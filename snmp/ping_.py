import subprocess
import platform, os

operating_sys = platform.system()



def ping(host):
    result = os.popen(' '.join(("ping", ping.param, host))).read()
    return 'TTL=' in result

ping.param = "-n 1  -w 100 -4" if platform.system().lower() == "windows" else "-c 1"

def ping1(ip):
    ping_command = ['ping', ip, '-n 1'] if operating_sys == 'Windows' else ['ping', ip, '-c 1']
    shell_needed = True if operating_sys == 'Windows' else False

    ping_output = subprocess.run(ping_command, shell=shell_needed, stdout=subprocess.PIPE)
    success = ping_output.returncode
    return True if success == 0 else False

# out = ping("192.168.88.1")
# print(out)

if True:
    for i in range(88, 90):
        for j in range(0, 255):
            ip = "192.168.{0}.{1}".format(i, j)
            print(ip, " is ", ping(ip))
