using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatSignalR.Hubs
{
    public interface IChatHub
    {
        Task ReceiveMessage(string message);
        Task SendMessage(string message);
        Task OnConnect(string message);
    }
}
