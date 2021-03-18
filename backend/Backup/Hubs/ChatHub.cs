using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatSignalR.Hubs
{
    public class ChatHub : Hub<IChatHub>
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
            await Groups.RemoveFromGroupAsync(connectionId, "room");
            _logger.LogInformation($"{connectionId} desconectado");
            await base.OnDisconnectedAsync(exception);
        }

        [HubMethodName("SendMessage")]
        public async Task SendMessage(string message)
        {
            await this.Clients.AllExcept(this.Context.ConnectionId).ReceiveMessage(message);
            _logger.LogInformation($"Mensagem enviada com sucesso: {message}");
        }
    }
}
