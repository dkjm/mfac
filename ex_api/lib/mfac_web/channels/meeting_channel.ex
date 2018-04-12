defmodule MfacWeb.MeetingChannel do
  use Phoenix.Channel 
  alias MfacWeb.Presence
  alias Mfac.Meetings.Meeting
  alias Mfac.Meetings.AgendaItemVote
  alias Mfac.Meetings.Invitation 
  alias Mfac.Meetings.AgendaItem
  alias Mfac.Meetings.Participant
  alias Mfac.Meetings.StackEntry
  alias Mfac.Meetings.Vote
  alias Mfac.Meetings.Proposal
  alias Mfac.Meetings.ProposalVote
  alias Mfac.Meetings.Amendment
  alias Mfac.Meetings.AmendmentVote
  alias Mfac.Accounts.User
  alias Mfac.Repo
  import Ecto.Query

  def join("meeting:" <> meeting_id, _payload, socket) do
    # check that meeting exists and that user
    # has access
    meeting_id = String.to_integer(meeting_id)
    meeting = Repo.get(Meeting, meeting_id)
    case meeting do
      nil ->
        {:error, %{reason: "meeting_does_not_exist"}}
      %Meeting{} ->
        user_meetings = Mfac.Meetings.list_user_meetings(socket.assigns.current_user)
        has_access = Enum.any?(user_meetings, fn(m) -> m.id == meeting.id end)
        case has_access do
          true ->
            send self(), {:after_join, meeting_id}
            {:ok, socket}
          false ->
            {:error, %{reason: "unauthorized"}}
        end    
    end   
  end

  def handle_in(event, data, socket) do
    IO.inspect(data, label: "meeting_channel recv: " <> event)

    "meeting:" <> meeting_id = socket.topic
    meeting_id = String.to_integer(meeting_id)
    user_id = socket.assigns.current_user

    case event do
      "update_meeting" ->
        meeting = Mfac.Meetings.load_meeting_complete(meeting_id, user_id)
        json = MfacWeb.MeetingView.render("socket_meeting_with_user_vote.json", %{meeting: meeting})
        push socket, "update_meeting", %{meeting: json}
        {:noreply, socket}

      _ ->
        {:noreply, socket}
    end
    
    
  end


  def handle_info({:after_join, meeting_id}, socket) do
    push(socket, "presence_state", Presence.list(socket))
    {:ok, _} = Presence.track(socket, socket.assigns.current_user, %{
      online_at: inspect(System.system_time(:seconds))
    })
    push_meeting_data(socket, meeting_id)
  end 


  def broadcast_event(event, meeting_id, payload) do
    IO.inspect(event, label: "EVENT")
    IO.inspect(meeting_id, label: "MEETING ID")
    IO.inspect(payload, label: "PAYLOAD")
    room = "meeting:#{meeting_id}"
    MfacWeb.Endpoint.broadcast(room, event, payload)
  end


  defp push_meeting_data(socket, meeting_id) do
    user_id = socket.assigns.current_user
    meeting = Mfac.Meetings.load_meeting_complete(meeting_id, user_id)
    json = MfacWeb.MeetingView.render("socket_meeting_with_user_vote.json", %{meeting: meeting})
    push socket, "update_meeting", %{meeting: json}
    {:noreply, socket}
  end
end