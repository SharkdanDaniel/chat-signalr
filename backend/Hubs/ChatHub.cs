using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatSignalR.Hubs
{
    public class Message
    {
        public string id { get; set; }
        public string type { get; set; }
        public string msg { get; set; }
        public DateTime date { get; set; }
    }

    public class ChatHub : Hub
    {
        ILogger _logger;

        public ChatHub(ILogger<ChatHub> logger)
        {
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
           var connectionId = Context.ConnectionId;
            _logger.LogInformation($"{connectionId} Está conectado");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var connectionId = Context.ConnectionId;
            _logger.LogInformation($"{connectionId} desconectado");
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(Message message)
        {
            await this.Clients.AllExcept(this.Context.ConnectionId).SendAsync("ReceiveMessage", message);
            _logger.LogInformation($"Mensagem enviada com sucesso: {message}");
        }
    }
}
