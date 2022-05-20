import sys
from raygun4py import raygunprovider
from lib.RunWorld import divideByZero


def handle_exception(exc_type, exc_value, exc_traceback):
    cl = raygunprovider.RaygunSender("7oqKqqnkcGwf0PdIZZVgQ")
    cl.send_exception(exc_info=(exc_type, exc_value, exc_traceback))


sys.excepthook = handle_exception

if __name__ == "__main__":
    divideByZero()
