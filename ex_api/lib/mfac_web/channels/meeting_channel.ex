defmodule MfacWeb.MeetingChannel do
  use Phoenix.Channel 
  alias Mfac.Meetings.Meeting

  def join("meeting:" <> id, _payload, socket) do

    send self(), {:update, id}
    {:ok, socket}
  end




  def handle_info({:update, type}, socket), do: socket |> push_update(type)

  # def handle_info({:update, type}, socket), do: socket |> push_update(type)

  defp push_update(socket, type) do
    Process.send_after(self(), {:update, type}, 20000)
    time = NaiveDateTime.utc_now
    meeting = Mfac.Repo.get(Meeting, String.to_integer(type)) |> Mfac.Repo.preload([:invitations, :participants, agenda_items: [:votes]]) |> IO.inspect(label: "meeting")
    m = MfacWeb.MeetingView.render("socket_meeting.json", %{meeting: meeting})
    push socket, "update_meeting", %{data_string: "meeting #{type} still going #{time}", meeting: m}

    {:noreply, socket}
  end


  # def handle_in("new_message", payload, socket) do
  #   broadcast! socket, "new_message", payload
  #   {:noreply, socket}
  # end
end

# data = {
#     'event': 'update_meeting',
#     'meeting': MeetingSlz(meeting, context={'requester': requester}).data,
#   }
#   message.reply_channel.send({"accept": True})

#   message.reply_channel.send({"text": json.dumps(data)})
# wsta 'ws://localhost:4000/socket/websocket' \
# '{"topic":"meeting:${meeting_id}" "event":"phx_join", "payload":"{}", "ref":"1"}'