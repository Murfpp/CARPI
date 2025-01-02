import psutil
# import wmi

def monitorar_recurso():
    # Uso de CPU
    cpu_percent = psutil.cpu_percent(interval=1)
    print(f"Uso da CPU: {cpu_percent}%")

    # Uso de RAM
    ram = psutil.virtual_memory()
    print(f"Uso da RAM: {ram.percent}%")

    # # Temperatura (verificando os sensores do sistema)
    # try:
    #     c = wmi.WMI(namespace="root\\wmi")
    #     for sensor in c.MSAcpi_ThermalZoneTemperature():
    #         temperatura = sensor.CurrentTemperature / 10.0 - 273.15
    #         print(f"Temperatura da CPU: {temperatura:.2f}°C")
    # except wmi.x_wmi as e:
    #     print(f"Erro ao acessar WMI: {e}")
    # except Exception as e:
    #     print(f"Erro ao obter temperatura: {e}")
    
monitorar_recurso()
