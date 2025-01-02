import os
import shutil

def limpar_temp():
    # Diretórios TEMP, %TEMP%, e C:\Windows\Temp
    temp_dirs = [os.getenv('TEMP'), os.getenv('TMP'), r'C:\Windows\Temp']
    
    for temp_dir in temp_dirs:
        if temp_dir:  # Verifica se o diretório existe
            try:
                # Deleta todos os arquivos dentro do diretório temp
                for filename in os.listdir(temp_dir):
                    file_path = os.path.join(temp_dir, filename)
                    try:
                        if os.path.isfile(file_path):
                            os.remove(file_path)
                        elif os.path.isdir(file_path):
                            shutil.rmtree(file_path)
                    except Exception as e:
                        print(f"Erro ao excluir {file_path}: {e}")
                print(f"Arquivos no diretório {temp_dir} foram limpos.")
            except Exception as e:
                print(f"Erro ao acessar o diretório {temp_dir}: {e}")
        else:
            print(f"Diretório {temp_dir} não encontrado.")

limpar_temp()
