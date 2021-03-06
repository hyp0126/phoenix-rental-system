using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using System.IO;
using Microsoft.AspNetCore.Http;
using Azure.Storage.Blobs.Models;
using System.Collections.Generic;

namespace Shared.Helpers
{
    public class AzureStorageService : IFileStorageService
    {
        private readonly BlobContainerClient blobContainer;

        public AzureStorageService(BlobServiceClient _blobServiceClient)
        {
            blobContainer = _blobServiceClient.GetBlobContainerClient("photos");
        }

        public async Task DeleteFile(string fileRoute)
        {
            var blobClient = blobContainer.GetBlobClient(fileRoute);
            await blobClient.DeleteIfExistsAsync();
        }

        public async Task<string> EditFile(IFormFile fileContent, string filePath)
        {
            if (!string.IsNullOrEmpty(filePath))
            {
                await DeleteFile(filePath);
            }

            return await SaveFile(fileContent);
        }

        public async Task<string> SaveFile(IFormFile fileContent)
        {
            //var fileName = Guid.NewGuid().ToString() + Path.GetExtension(fileContent.FileName);
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(fileContent.Name);

            var blobClient = blobContainer.GetBlobClient(fileName);
            await blobClient.UploadAsync(fileContent.OpenReadStream(), true);

            return fileName;
        }


        public async Task<Stream> GetFile(string fileName)
        {
            Stream stream = null;

            if (await blobContainer.ExistsAsync())
            {
                var blobClient = blobContainer.GetBlobClient(fileName);

                if (await blobClient.ExistsAsync())
                {
                    stream = new MemoryStream();
                    BlobDownloadInfo download = await blobClient.DownloadAsync();
                    await download.Content.CopyToAsync(stream);
                    stream.Seek(0, SeekOrigin.Begin);
                }
            }
            
            return stream; // returns a FileStreamResult
        }

        public string CheckFile(IFormFile fileContent)
        {
            string[] ACCEPTED_FILE_TYPES = { ".jpg", ".jpeg", ".png", ".gif" };

            //if (fileContent.FileName == "") return "Err:Null File";
            if (fileContent.Name == "") return "Err:Null File";
            if (fileContent.Length == 0) return "Err:Empty File";
            if (fileContent.Length > 10 * 1024 * 1024) return "Err:Max file size exceeded(Max: 10MB)";
            //if (Array.IndexOf(ACCEPTED_FILE_TYPES, Path.GetExtension(fileContent.FileName).ToLower()) == -1) return "Err:Invalid file type.";
            if (Array.IndexOf(ACCEPTED_FILE_TYPES, Path.GetExtension(fileContent.Name).ToLower()) == -1) return "Err:Invalid file type.";
            return null;
        }

        public static async Task<byte[]> GetBytes(IFormFile formFile)
        {
            using (var memoryStream = new MemoryStream())
            {
                await formFile.CopyToAsync(memoryStream);
                return memoryStream.ToArray();
            }
        }
    }
}
