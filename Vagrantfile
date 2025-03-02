# -*- mode: ruby -*-
# vi: set ft=ruby : 

Vagrant.configure("2") do |config|
  # Desactiva actualizaciones automáticas del plugin vagrant-vbguest si lo tienes instalado
  if Vagrant.has_plugin?("vagrant-vbguest")
    config.vbguest.no_install  = true
    config.vbguest.auto_update = false
    config.vbguest.no_remote   = true
  end

  # Definimos la máquina servidorUbuntu con la nueva box pública
  config.vm.define :servidorUbuntu do |servidorUbuntu|
    servidorUbuntu.vm.box = "Parcial1/ServidorUbuntu"
    servidorUbuntu.vm.box_version = "0.0.1"
    servidorUbuntu.vm.network :private_network, ip: "192.168.100.3"
    servidorUbuntu.vm.hostname = "servidorUbuntu"

    # Sincronizar carpetas entre la máquina host y la VM
    servidorUbuntu.vm.synced_folder "microwebAppBase-main/frontend",       "/home/vagrant/microwebAppBase-main/frontend"
    servidorUbuntu.vm.synced_folder "microwebAppBase-main/microUsers",     "/home/vagrant/microwebAppBase-main/microUsers"
    servidorUbuntu.vm.synced_folder "microwebAppBase-main/microProducts",  "/home/vagrant/microwebAppBase-main/microProducts"
    #servidorUbuntu.vm.synced_folder "microwebAppBase-main/microOrders",   "/home/vagrant/microwebAppBase-main/microOrders"
    #servidorUbuntu.vm.synced_folder "microwebAppBase-main/init.sql",      "/home/vagrant/microwebAppBase-main/init.sql"
  end
end
