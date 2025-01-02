import subprocess

def redefinir_menu_iniciar():
    """
    Redefine os ícones fixados do Menu Iniciar no Windows.
    """
    try:
        print("Redefinindo ícones fixados no Menu Iniciar...")

        comando = (
            'powershell -Command "& {'
            '    Get-ChildItem -Path "$env:LOCALAPPDATA\\Microsoft\\Windows\\Shell" '
            '-Filter "LayoutModification.xml" | Remove-Item -Force'
            '}"'
        )

        subprocess.run(comando, shell=True, check=True)
        print("Ícones fixados foram redefinidos com sucesso! Reinicie o Explorador do Windows para aplicar as alterações.")
    except subprocess.CalledProcessError as e:
        print(f"Erro ao redefinir ícones fixados: {e}")
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")


if __name__ == "__main__":
    redefinir_menu_iniciar()
