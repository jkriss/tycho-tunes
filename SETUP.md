## Plug your CHIP in and connect

Something like

      screen /dev/tty.usbmodem1413 115200

Log in with username `root` or `chip`, password `chip`.

## Get on your wireless network

To see a list of networks:

    nmcli device wifi list

Then:

    sudo nmcli device wifi connect 'your-network-name' password 'your-password' ifname wlan0

## If you want to have an automatic local hostname

    sudo apt-get install avahi-daemon
    sudo nano /etc/avahi/services/afpd.service

...and paste this in:

    <?xml version="1.0" standalone='no'?><!--*-nxml-*-->
    <!DOCTYPE service-group SYSTEM "avahi-service.dtd">
    <service-group>
    <name replace-wildcards="yes">%h</name>
    <service>
    <type>_afpovertcp._tcp</type>
    <port>548</port>
    </service>
    </service-group>

Then:

    sudo /etc/init.d/avahi-daemon restart

Now it's reachable at `chip.local`. If you want a different hostname, change it in `/etc/hostname` and `/etc/hosts` and run `sudo /etc/init.d/avahi-daemon restart` again.

## Install some stuff

We need a more recent node.js, build tools, and some native libraries for mp3 playback and usb device handling.

    sudo apt-get update
    sudo apt-get install -y lsb-release apt-transport-https

    curl --silent https://deb.nodesource.com/gpgkey/nodesource.gpg.key | sudo apt-key add -

    VERSION=node_6.x
    DISTRO="$(lsb_release -s -c)"
    echo "deb https://deb.nodesource.com/$VERSION $DISTRO main" | sudo tee /etc/apt/sources.list.d/nodesource.list
    echo "deb-src https://deb.nodesource.com/$VERSION $DISTRO main" | sudo tee -a /etc/apt/sources.list.d/nodesource.list

    sudo apt-get update
    sudo apt-get install -y nodejs build-essential
    # sudo ln -s /usr/bin/nodejs /usr/bin/node
    # ^^ not necessary?

    sudo apt-get install -y mpg123 libusb-1.0-0-dev

## Install the music player code:

Log out, then log in as chip.

    mkdir tunes
    cd tunes

Copy the code over [TBD]

    npm install

Plug in the RFID reader and run it:

    sudo node index.js

## To run stuff on boot, forever

    sudo crontab -u root -e

Then edit that file to include the following line:

    @reboot cd /home/chip/tunes && ./node_modules/.bin/forever start -c /usr/bin/node index.js
