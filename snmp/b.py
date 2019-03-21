import subprocess
import os

with open(os.devnull, "wb") as limbo:
    for n in range(0, 255):
        ip = "192.168.88.{0}".format(n)
        result = subprocess.Popen(["ping", "-n", "1", "-w", "2", ip],
                                  stdout=limbo, stderr=limbo).wait()
        if result:
            print(ip, "inactive")
        else:
            print(ip, "active")
