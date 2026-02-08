#define _WINSOCK_DEPRECATED_NO_WARNINGS
#include <winsock2.h>
#include <ws2tcpip.h>
#include <iostream>
#include <string>
#include <vector>
#include <thread>
#include <mutex>

// Link with Ws2_32.lib
#pragma comment(lib, "Ws2_32.lib")

// Configuration
const int LISTEN_PORT = 5001;
const int BACKEND_PORT = 5000;
const std::string BACKEND_HOST = "127.0.0.1";
const int BUFFER_SIZE = 4096;
const int MAX_LOG_LENGTH = 500; // Truncate output after 500 chars

// ANSI Colors
const std::string COLOR_CYAN = "\033[96m";
const std::string COLOR_GREEN = "\033[92m";
const std::string COLOR_RESET = "\033[0m";
const std::string COLOR_GREY = "\033[90m";

std::mutex console_mutex;

void log_traffic(const std::string& label, const char* buffer, int len, const std::string& color) {
    std::lock_guard<std::mutex> lock(console_mutex);
    std::cout << color << label << " (" << len << " bytes):" << COLOR_RESET << "\n";
    std::cout << COLOR_GREY;
    
    int print_len = (len > MAX_LOG_LENGTH) ? MAX_LOG_LENGTH : len;
    
    for (int i = 0; i < print_len; ++i) {
        char c = buffer[i];
        if ((c >= 32 && c <= 126) || c == '\n' || c == '\r') {
            std::cout << c;
        } else {
            std::cout << '.';
        }
    }
    
    if (len > MAX_LOG_LENGTH) {
        std::cout << "\n... [TRUNCATED " << (len - MAX_LOG_LENGTH) << " BYTES] ...";
    }
    
    std::cout << COLOR_RESET << "\n\n";
}

void handle_client(SOCKET client_sock) {
    SOCKET backend_sock = socket(AF_INET, SOCK_STREAM, 0);
    sockaddr_in backend_addr;
    backend_addr.sin_family = AF_INET;
    backend_addr.sin_addr.s_addr = inet_addr(BACKEND_HOST.c_str());
    backend_addr.sin_port = htons(BACKEND_PORT);

    if (connect(backend_sock, (sockaddr*)&backend_addr, sizeof(backend_addr)) < 0) {
        std::cerr << "X Failed to connect to backend at " << BACKEND_HOST << ":" << BACKEND_PORT << "\n";
        closesocket(client_sock);
        closesocket(backend_sock);
        return;
    }

    fd_set read_fds;
    char buffer[BUFFER_SIZE];

    while (true) {
        FD_ZERO(&read_fds);
        FD_SET(client_sock, &read_fds);
        FD_SET(backend_sock, &read_fds);

        if (select(0, &read_fds, NULL, NULL, NULL) == SOCKET_ERROR) break;

        // Frontend -> Backend
        if (FD_ISSET(client_sock, &read_fds)) {
            int bytes = recv(client_sock, buffer, BUFFER_SIZE, 0);
            if (bytes <= 0) break;
            log_traffic("->  REQUEST", buffer, bytes, COLOR_CYAN);
            send(backend_sock, buffer, bytes, 0);
        }

        // Backend -> Frontend
        if (FD_ISSET(backend_sock, &read_fds)) {
            int bytes = recv(backend_sock, buffer, BUFFER_SIZE, 0);
            if (bytes <= 0) break;
            log_traffic("<-  RESPONSE", buffer, bytes, COLOR_GREEN);
            send(client_sock, buffer, bytes, 0);
        }
    }

    closesocket(client_sock);
    closesocket(backend_sock);
}

int main() {
    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        std::cerr << "WSAStartup failed.\n";
        return 1;
    }

    // Enable ANSI Colors in Windows Console
    HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    DWORD dwMode = 0;
    GetConsoleMode(hOut, &dwMode);
    dwMode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING;
    SetConsoleMode(hOut, dwMode);

    SOCKET listen_sock = socket(AF_INET, SOCK_STREAM, 0);
    sockaddr_in server_addr;
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(LISTEN_PORT);

    if (bind(listen_sock, (sockaddr*)&server_addr, sizeof(server_addr)) == SOCKET_ERROR) {
        std::cerr << "Bind failed. Is port " << LISTEN_PORT << " already in use?\n";
        return 1;
    }

    listen(listen_sock, 3);

    std::cout << "============================================================\n";
    std::cout << ">> C++ PROXY LISTENING ON PORT " << LISTEN_PORT << "\n";
    std::cout << ">> Point Frontend to: http://localhost:" << LISTEN_PORT << "\n";
    std::cout << ">> Forwarding to: http://localhost:" << BACKEND_PORT << "\n";
    std::cout << "============================================================\n\n";

    while (true) {
        sockaddr_in client_addr;
        int len = sizeof(client_addr);
        SOCKET client_sock = accept(listen_sock, (sockaddr*)&client_addr, &len);
        
        if (client_sock != INVALID_SOCKET) {
            std::thread(handle_client, client_sock).detach();
        }
    }

    closesocket(listen_sock);
    WSACleanup();
    return 0;
}