using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace ChatSignalR.Hubs
{
    public class Message
    {
        public string type { get; set; }
        public string msg { get; set; }
        public DateTime date { get; set; }
    }

    public class Users
    {
        public string nome { get; set; }
        public RoomType roomType { get; set; }

        public enum RoomType
        {
            [Description("Mulher")]
            mulher = 0,
            [Description("Homem")]
            homem = 1,
            [Description("Ambos")]
            ambos = 2
        }
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
            var message = new Users();
            var connectionId = Context.ConnectionId;
            await Groups.AddToGroupAsync(message.nome, message.roomType.ToString());
            _logger.LogInformation($"{connectionId} Está conectado");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var message = new Users();
            var connectionId = Context.ConnectionId;
            await Groups.RemoveFromGroupAsync(message.nome, message.roomType.ToString());
            _logger.LogInformation($"{connectionId} desconectado");
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(Message message)
        {
            var user = new Users();
            await this.Clients.Group(user.roomType.ToString()).SendAsync("ReceiveMessage", message);
            _logger.LogInformation($"Mensagem enviada com sucesso: {message}");
        }
    }
}
