defmodule MfacWeb.MeetingChannel do
  use Phoenix.Channel 
  alias Mfac.Meetings.Meeting
  alias Mfac.Meetings.AgendaItemVote
  alias Mfac.Meetings.Invitation 
  alias Mfac.Meetings.AgendaItem
  alias Mfac.Meetings.Participant
  alias Mfac.Meetings.StackEntry
  alias Mfac.Accounts.User
  import Ecto.Query

  def join("meeting:" <> id, _payload, socket) do

    send self(), {:update, id}
    {:ok, socket}
  end




  def handle_info({:update, type}, socket), do: socket |> push_update(type)

  # def handle_info({:update, type}, socket), do: socket |> push_update(type)
  # def send_update(data) do
  #   case data do
  #     %AgendaItemVote{} -> 
  #       agenda_item = MfacWeb.AgendaItemView.render("show.json", %{agenda_item: data})
  #       push(socket, "add_agenda_item", %{agenda_item: agenda_item})
  #     end
  # end

  def broadcast_event(event, meeting_id, payload) do
    IO.inspect(event, label: "EVENT")
    IO.inspect(meeting_id, label: "MEETING ID")
    IO.inspect(payload, label: "PAYLOAD")
    room = "meeting:#{meeting_id}"
    MfacWeb.Endpoint.broadcast(room, event, payload)
  end

  defp push_update(socket, id) do
    # Process.send_after(self(), {:update, id}, 20000)
    time = NaiveDateTime.utc_now
    meeting_id = String.to_integer(id)
    
    query = 
      from m in Meeting,
      left_join: o in User, on: o.id == m.user_id,
      left_join: i in Invitation, on: i.meeting_id == ^id,
      left_join: inviter in User, on: inviter.id == i.inviter_id,
      left_join: invitee in User, on: invitee.id == i.invitee_id,
      left_join: p in Participant, on: p.meeting_id == ^id,
      left_join: a in AgendaItem, on: a.meeting_id == ^id,
      left_join: v in AgendaItemVote, on: v.agenda_item_id == a.id,
      left_join: s in StackEntry, on: s.agenda_item_id == a.id,
      left_join: u in User, on: u.id == a.user_id,
      where: m.id == ^id,
      preload: [
        owner: o, 
        participants: p, 
        agenda_items: {a, [
          votes: v, 
          stack_entries: s, 
          owner: u
        ]},
        invitations: {i, [
          inviter: inviter,
          invitee: invitee,
          meeting: m,
        ]},
      ]

    
    # TODO:(ja) this should be handled in the query if possible. reducing them now just to get it working
    meeting = List.first(Mfac.Repo.all(query)) #|> IO.inspect(label: "meeting")


    meeting_with_votes = Map.put(meeting, :agenda_items, Mfac.Meetings.get_formatted_agenda_item_votes(meeting.agenda_items)) #|> IO.inspect(label: "with votes")
    
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