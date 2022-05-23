import rollbar
from aiohttp import web
from lib.RunWorld import divideByZero


rollbar.init("rollbarCode")


async def handle(request):
    try:
        divideByZero()
    except ZeroDivisionError as exception:
        rollbar.report_exc_info()
    print("i just threw an error")
    return web.Response(text="i just threw an error")


app = web.Application()
app.add_routes([web.get("/", handle)])

if __name__ == "__main__":
    web.run_app(app)
