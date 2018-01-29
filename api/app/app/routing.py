from channels.routing import route, include
from .consumers import (
  meetings_connect, 
  meetings_message, 
  meetings_disconnect,
  ws_connect, 
  ws_message, 
  ws_disconnect, 
  topic_consumer, 
)


meeting_routing = [
  route("websocket.connect", meetings_connect, path=r"^/(?P<meeting_id>[a-zA-Z0-9_]+)/$"),
  route("websocket.receive", meetings_message, path=r"^/(?P<meeting_id>[0-9]+)/$"),
  route("websocket.disconnect", meetings_disconnect, path=r"^/(?P<meeting_id>[0-9]+)/$"),
]


# ** Not currently using topic routing
# 180127 - MPP
topic_routing = [
  route("websocket.connect", ws_connect, path=r"^/(?P<topic_id>[a-zA-Z0-9_]+)/$"),
  route("websocket.receive", ws_message, path=r"^/(?P<topic_id>[0-9]+)/$"),
  route("websocket.disconnect", ws_disconnect, path=r"^/(?P<topic_id>[0-9]+)/$"),
]



channel_routing = [
  # You can use a string import path as the first argument as well.
  include(topic_routing, path=r"^/topics"),
  include(meeting_routing, path=r"^/meetings")
]