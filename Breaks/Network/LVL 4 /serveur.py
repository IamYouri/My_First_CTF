import socket
import threading
import time

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind(('0.0.0.0', 1234))
    server_socket.listen(100)  
    print("Serveur démarré sur le port 1234")

    syn_count = 0
    flag_displayed = False
    flag = "CTF{V2VsY29tZVRvTEFBYW1SY2hheWVk}"

    def syn_flood_detection():
        nonlocal syn_count, flag_displayed
        while True:
            time.sleep(1)
            print(f"Checking: syn_count = {syn_count}")
            if syn_count > 10 and not flag_displayed:  
                print(f"Flag: {flag}")
                flag_displayed = True

    detection_thread = threading.Thread(target=syn_flood_detection)
    detection_thread.start()

    while True:
        try:
            client_socket, address = server_socket.accept()
            syn_count += 1
            print(f"Connexion reçue: {syn_count} de {address}")
            # Simuler une connexion semi-ouverte en ne fermant pas immédiatement
            time.sleep(5)
            client_socket.close()
        except socket.error:
            continue

if __name__ == "__main__":
    server_thread = threading.Thread(target=start_server)
    server_thread.start()
