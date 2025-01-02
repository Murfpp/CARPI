import subprocess
import psutil

def listar_unidades():
    unidades = [disk.device.replace(':\\', '') for disk in psutil.disk_partitions(all=False)]
    return unidades

def desfragmentar_disco(drive_letter):
    try:
        print(f"Iniciando desfragmentação da unidade {drive_letter}:...")
        comando = f"defrag {drive_letter}: /O"
        subprocess.run(comando, shell=True, check=True)
        print(f"Desfragmentação da unidade {drive_letter} concluída com sucesso!")
    except subprocess.CalledProcessError as e:
        print(f"Erro ao desfragmentar a unidade {drive_letter}: {e}")
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")

if __name__ == "__main__":
    unidades = listar_unidades()
    if not unidades:
        print("Nenhuma unidade disponível para desfragmentação foi encontrada.")
    else:
        print(f"Unidades detectadas: {', '.join(unidades)}")
        for unidade in unidades:
            desfragmentar_disco(unidade)
