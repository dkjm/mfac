defmodule MfacWeb.MeetingChannel do
  use Phoenix.Channel 
  alias Mfac.Meetings.Meeting
  alias Mfac.Meetings.AgendaItemVote
  alias Mfac.Meetings.Invitation 
  alias Mfac.Meetings.AgendaItem
  alias Mfac.Meetings.Participant
  import Ecto.Query

  def join("meeting:" <> id, _payload, socket) do

    send self(), {:update, id}
    {:ok, socket}
  end




  def handle_info({:update, type}, socket), do: socket |> push_update(type)

  # def handle_info({:update, type}, socket), do: socket |> push_update(type)

  defp push_update(socket, id) do
    # Process.send_after(self(), {:update, id}, 20000)
    time = NaiveDateTime.utc_now
    meeting_id = String.to_integer(id)
    
    query = 
      from m in Meeting,
      left_join: i in Invitation, on: i.meeting_id == ^id,
      left_join: p in Participant, on: p.meeting_id == ^id,
      left_join: a in AgendaItem, on: a.meeting_id == ^id,
      left_join: v in AgendaItemVote, on: v.agenda_item_id == a.id,
      where: m.id == ^id,
      preload: [invitations: i, participants: p, agenda_items: {a, votes: v}]

    
    # TODO:(ja) this should be handled in the query if possible. reducing them now just to get it working
    meeting = 
      List.first(Mfac.Repo.all(query)) |> IO.inspect(label: "meeting")

    agenda_items = Enum.map(meeting.agenda_items, fn item -> 
      votes = Enum.reduce(item.votes, %{up: 0, down: 0, meh: 0, user_vote: nil}, fn(vote, acc) -> 
        case vote.vote_type do
          "UP" -> 
            Map.put(acc, :up, Map.get(acc, :up) + 1)
          "DOWN" ->
            Map.put(acc, :down, Map.get(acc, :down) + 1)
          "MEH" ->
            Map.put(acc, :meh, Map.get(acc, :meh) + 1)
        end  
      end)

      Map.put(item, :votes, votes)
    end)

    meeting_with_votes = Map.put(meeting, :agenda_items, agenda_items) |> IO.inspect(label: "with votes")
    
    # user_vote_type = votes.filter(owner=requester)[0].vote_type
    #   result = {
    #     'up': up,
    #     'down': down,
    #     'meh': meh,
    #     'user_vote': user_vote_type,
    #   } 
    m = MfacWeb.MeetingView.render("socket_meeting.json", %{meeting: meeting_with_votes})
    push socket, "update_meeting", %{data_string: "meeting #{id} still going #{time}", meeting: m}

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