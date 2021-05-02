const cloudConfig = {
  userData: `#cloud-config

  # This is the user-data configuration file for cloud-init. By default this sets
  # up an initial user called "ubuntu" with password "ubuntu", which must be
  # changed at first login. However, many additional actions can be initiated on
  # first boot from this file. The cloud-init documentation has more details:
  #
  # https://cloudinit.readthedocs.io/
  #
  # Some additional examples are provided in comments below the default
  # configuration.
  
  # On first boot, set the (default) ubuntu user's password to "ubuntu" and
  # expire user passwords
  chpasswd:
    expire: true
    list:
    - ubuntu:ubuntu
  
  # Enable password authentication with the SSH daemon
  ssh_pwauth: true
  
  ## On first boot, use ssh-import-id to give the specific users SSH access to
  ## the default user
  #ssh_import_id:
  #- lp:my_launchpad_username
  #- gh:my_github_username
  
  ## Add users and groups to the system, and import keys with the ssh-import-id
  ## utility
  #groups:
  #- robot: [robot]
  #- robotics: [robot]
  #- pi
  #
  users:
    - name: ubuntu
      gecos: Bar B. Foo
      sudo: ALL=(ALL) NOPASSWD:ALL
      groups: users, admin
      ssh_import_id: None
      lock_passwd: true
      ssh_authorized_keys:
        - <SSH_AUTH_KEY>
  
  ## Update apt database and upgrade packages on first boot
  #package_update: true
  #package_upgrade: true
  
  ## Install additional packages on first boot
  #packages:
  #- pwgen
  #- pastebinit
  #- [libpython2.7, 2.7.3-0ubuntu3.1]
  
  ## Write arbitrary files to the file-system (including binaries!)
  #write_files:
  #- path: /etc/default/keyboard
  #  content: |
  #    # KEYBOARD configuration file
  #    # Consult the keyboard(5) manual page.
  #    XKBMODEL="pc105"
  #    XKBLAYOUT="gb"
  #    XKBVARIANT=""
  #    XKBOPTIONS="ctrl: nocaps"
  #  permissions: '0644'
  #  owner: root:root
  #- encoding: gzip
  #  path: /usr/bin/hello
  #  content: !!binary |
  #    H4sIAIDb/U8C/1NW1E/KzNMvzuBKTc7IV8hIzcnJVyjPL8pJ4QIA6N+MVxsAAAA=
  #  owner: root:root
  #  permissions: '0755'
  
  ## Run arbitrary commands at rc.local like time
  runcmd:
  #- [ sh, -xc, "echo $(date) ': hello world!'" ]
  #- [ wget, "http://ubuntu.com", -O, /run/mydir/index.html ]
  
  hostname: <HOSTNAME>
  `,
  networkConfig: `# This file contains a netplan-compatible configuration which cloud-init
  # will apply on first-boot. Please refer to the cloud-init documentation and
  # the netplan reference for full details:
  #
  # https://cloudinit.readthedocs.io/
  # https://netplan.io/reference
  #
  # Some additional examples are commented out below
  
  version: 2
  ethernets:
    eth0:
      dhcp4: true
      optional: true
  wifis:
    wlan0:
      dhcp4: false
      optional: true
      access-points:
        "WLAN_123123":
          password: "<PASSWORD>"
  
      addresses: [192.168.1.100/24]
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8,8.8.4.4]
  
  `,
};

export default cloudConfig;
