using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.BizLogic;
using Server.Models;
using Shared.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Net.Mail;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly PhoenixContext context;
        private readonly IMapper mapper;
        private readonly NotificationBiz NB;
        private readonly UserBiz UB;
        private readonly IConfiguration configuration;

        public NotificationController(PhoenixContext _context, IMapper _mapper, IConfiguration _configuration)
        {
            this.context = _context;
            this.mapper = _mapper;
            NB = new NotificationBiz(context);
            UB = new UserBiz(context);
            configuration = _configuration;
        }

        [HttpGet("GetNotification")]
        public async Task<ActionResult<List<NotificationDTO>>> GetNotification(string userId, DateTime startDate)
        {
            List<NotificationDTO> dtoList = new List<NotificationDTO>();

            DateTime compareDate = new DateTime(startDate.Year, startDate.Month, startDate.Day);
            var notiList = await NB.GetNotification(userId, compareDate);
            foreach (var noti in notiList)
            {
                var fromUser = await UB.GetUserDetails(noti.FromUserId);
                var ToUser = await UB.GetUserDetails(noti.ToUserId);
                NotificationDTO dto = new NotificationDTO();
                dto = mapper.Map<NotificationDTO>(noti);
                dto.FromUserName = fromUser.FirstName + " " + fromUser.LastName;
                dto.ToUserName = ToUser.FirstName + " " + ToUser.LastName;
                dto.ItemTitle = noti.Item.Name;
                dtoList.Add(dto);
            }

            return dtoList;
        }

        [HttpPost("InsertNotification")]
        public async Task<ActionResult<NotificationDTO>> InsertNotification(Notification dto)
        {
            var ret = mapper.Map<NotificationDTO>(await NB.InsertNotification(dto));
            SendNotificationEmail(dto);
            return ret;
        }

        [HttpPut("UpdateNotificationStatus")]
        public async Task<ActionResult<NotificationDTO>> UpdateNotificationStatus(int notiId)
        {
            return mapper.Map<NotificationDTO>(await NB.UpdateReadStatusToRead(notiId));
        }

        private async Task<bool> SendNotificationEmail(Notification noti)
        {
            var accDetails = await UB.GetUserAccDetails(noti.ToUserId);
            string to = accDetails.Email;
            string from = configuration["Smtp:Email"];  
            MailMessage message = new MailMessage(from, to);

            string mailbody = noti.Message;
            message.Subject = "PRS Notification: Login PRS and Check Notification";
            message.Body = mailbody;
            message.BodyEncoding = Encoding.UTF8;
            message.IsBodyHtml = true;
            SmtpClient client = new SmtpClient("smtp.gmail.com", 587); //Gmail smtp    
            System.Net.NetworkCredential basicCredential1 = new
            System.Net.NetworkCredential(configuration["Smtp:Email"], configuration["Smtp:Password"]);
            client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            client.Credentials = basicCredential1;
            try
            {
                client.Send(message);
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return true;
        }
    }


}
