from aiohttp import web
import sentry_sdk
from lib.RunWorld import divideByZero

project_url_sentry = "https://xx@xxx.ingest.sentry.io/xxx"
project_url_glitch = "https://xxx@app.glitchtip.com/xxx"

sentry_sdk.init(
    project_url_glitch, traces_sample_rate=1.0,
)


async def handle(request):
    permission_level = 0
    try:
        divideByZero()
    except ZeroDivisionError as exception:
        with sentry_sdk.configure_scope() as scope:
            scope.user = {"username": "AK", "id": "1234"}
            scope.set_tag("PermissionLevel", permission_level)
            scope.set_context(
                "UserContext", {"Last Login": "1649666667"},
            )
            sentry_sdk.capture_exception(exception)
    print("i just threw an error")
    return web.Response(text="i just threw an error")


app = web.Application()
app.add_routes([web.get("/", handle)])

if __name__ == "__main__":
    web.run_app(app)
