from aiohttp import web
import sentry_sdk
from lib.RunWorld import divideByZero

project_url_sentry = "project_url"
project_url_glitch = "project_url"

sentry_sdk.init(
    project_url_sentry, traces_sample_rate=1.0,
)


async def throwError(request):
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


async def errorPage(request):
    try:
        divideByZero()
    except ZeroDivisionError as exception:
        event_id = sentry_sdk.capture_exception(exception)
    with open("index.html", "r", encoding="utf-8") as f:
        page = f.read()
        page = page.replace("event_id", event_id)
        return web.Response(body=page, content_type="text/html")


app = web.Application()
app.add_routes([web.get("/", throwError)])
app.add_routes([web.get("/home", errorPage)])

if __name__ == "__main__":
    web.run_app(app)
