from channels.routing import route, include
from .consumers import (
  meetings_connect, 
  meetings_message, 
  meetings_disconnect,

  user_connect,
  user_message,
  user_disconnect,
)

meetings_routing = [
  #route('websocket.connect', meetings_connect, path=r"^/(?P<meeting_id>[a-zA-Z0-9_]+)/$"),
  route('websocket.connect', meetings_connect, path=r"^/(?P<meeting_id>[a-zA-Z0-9_]+)/token=(?P<token>[a-zA-Z0-9_\-]+)/$"),
  route('websocket.receive', meetings_message, path=r"^/(?P<meeting_id>[0-9]+)/$"),
  route('websocket.disconnect', meetings_disconnect, path=r"^/(?P<meeting_id>[a-zA-Z0-9_]+)/token=(?P<token>[a-zA-Z0-9_\-]+)/$"),
]

user_routing = [
  route('websocket.connect', user_connect, path=r"^/(?P<user_id>[a-zA-Z0-9_]+)/token=(?P<token>[a-zA-Z0-9_\-]+)/$"),
  route('websocket.receive', user_message, path=r"^/(?P<user_id>[0-9]+)/$"),
  route('websocket.disconnect', user_disconnect, path=r"^/(?P<user_id>[0-9]+)/$"),
]



channel_routing = [
  include(meetings_routing, path=r"^/meetings"),
  include(user_routing, path=r"^/users"),
]