import subprocess

# Função para configurar o DNS para servidores rápidos (Google DNS, OpenDNS, etc.)
def set_dns():
    try:
        # Definir DNS do Google
        subprocess.run("netsh interface ip set dns name=\"Ethernet\" static 8.8.8.8", shell=True, check=True)
        subprocess.run("netsh interface ip add dns name=\"Ethernet\" 8.8.4.4 index=2", shell=True, check=True)
        print("DNS configurado para Google DNS (8.8.8.8 e 8.8.4.4).")
    except subprocess.CalledProcessError as e:
        print(f"Erro ao configurar DNS: {e}")

# Função para otimizar as configurações de TCP/IP
def optimize_tcp_ip():
    try:
        # Desabilitar o RWIN (TCP Window Scaling) para conexões mais rápidas
        subprocess.run("netsh interface tcp set global autotuninglevel=normal", shell=True, check=True)
        # Habilitar a aceleração do TCP
        subprocess.run("netsh interface tcp set global chimney=enabled", shell=True, check=True)
        print("Otimizações de TCP/IP aplicadas.")
    except subprocess.CalledProcessError as e:
        print(f"Erro ao otimizar TCP/IP: {e}")

# Função para limpar o cache do DNS
def flush_dns_cache():
    try:
        subprocess.run("ipconfig /flushdns", shell=True, check=True)
        print("Cache DNS limpo.")
    except subprocess.CalledProcessError as e:
        print(f"Erro ao limpar cache DNS: {e}")

# Função principal para otimizar a rede
def optimize_network():
    print("Iniciando a otimização da rede...")
    set_dns()
    optimize_tcp_ip()
    flush_dns_cache()
    print("Otimização concluída.")

optimize_network()