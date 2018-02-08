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


  def broadcast_event(event, meeting_id, payload) do
    IO.inspect(event, label: "EVENT")
    IO.inspect(meeting_id, label: "MEETING ID")
    IO.inspect(payload, label: "PAYLOAD")
    room = "meeting:#{meeting_id}"
    MfacWeb.Endpoint.broadcast(room, event, payload)
  end


  defp push_update(socket, id) do
    # Process.send_after(self(), {:update, id}, 20000)
    user_id = socket.assigns.current_user
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
    meeting = List.first(Mfac.Repo.all(query))
    meeting_with_votes = Map.put(meeting, :agenda_items, Mfac.Meetings.get_formatted_agenda_item_votes(meeting.agenda_items, user_id))
    m = MfacWeb.MeetingView.render("socket_meeting_with_user_vote.json", %{meeting: meeting_with_votes})
    push socket, "update_meeting", %{meeting: m}
    {:noreply, socket}
  end
end