defmodule MfacWeb.UserChannel do
  use Phoenix.Channel 
  alias Mfac.Meetings.Meeting
  alias Mfac.Meetings.AgendaItemVote
  alias Mfac.Meetings.Invitation 
  alias Mfac.Meetings.AgendaItem
  alias Mfac.Meetings.Participant
  alias Mfac.Meetings.StackEntry
  alias Mfac.Accounts.User
  alias Mfac.Repo
  import Ecto.Query

  def join("user:" <> id, _payload, socket) do
    # check that room is actually intended for
    # current_user 
    user_id = String.to_integer(id)
    case socket.assigns.current_user == user_id do
      true ->
        send self(), {:update, id}
        {:ok, socket}
      false ->
         {:error, %{reason: "unauthorized"}}
    end 
  end


  def handle_info({:update, id}, socket), do: socket |> push_update(id)


  # TODO(MP - 2/8): don't use broadcast here,
  # even though it shouldn't matter because
  # only one user will be connected to this
  # channel.  Better, more idiomatic approach
  # would be to push_update directly to channel
  def broadcast_event(event, user_id, payload) do
    IO.inspect(event, label: "EVENT")
    IO.inspect(user_id, label: "USER ID")
    IO.inspect(payload, label: "PAYLOAD")
    room = "user:#{user_id}"
    MfacWeb.Endpoint.broadcast(room, event, payload)
  end

  defp push_update(socket, id) do
    user_id = socket.assigns.current_user
    user = Repo.get(User, user_id)
    invitations_query = 
      from i in Invitation,
        left_join: m in Meeting, on: i.meeting_id == m.id,
        left_join: inviter in User, on: i.inviter_id == inviter.id,
        left_join: invitee in User, on: i.invitee_id == invitee.id,
        where: i.invitee_id == ^user_id,
        preload: [
          meeting: m,
          inviter: inviter,
          invitee: invitee,
        ]
    invitations = Mfac.Repo.all(invitations_query)

    contacts_query = from u in User, where: u.id != ^user_id
    contacts = Mfac.Repo.all(contacts_query)

    data = %{
      user_data: user, 
      meeting_invitations: invitations, 
      contacts: contacts}
    json = MfacWeb.UserView.render("user_data.json", %{user_data: data})

    push socket, "update_user_data", %{user_data: json}
    {:noreply, socket}
  end

end