defmodule Mfac.Meetings do
  @moduledoc """
  The Meetings context.
  """

  import Ecto.Query, warn: false
  alias Mfac.Repo


  alias Mfac.Meetings.Meeting
  alias Mfac.Meetings.Invitation
  alias Mfac.Meetings.AgendaItem
  alias Mfac.Meetings.AgendaItemVote
  alias Mfac.Meetings.StackEntry
  alias Mfac.Meetings.Participant
  alias Mfac.Accounts.User


  defp send_broadcast(event, meeting_id, payload) do
    MfacWeb.MeetingChannel.broadcast_event(event, meeting_id, payload)
  end

  @doc """
  Returns the list of all meetings.

  """
  def list_meetings do
    Repo.all(Meeting)
  end

  def load_meeting_complete(meeting_id, user_id) do
    id = meeting_id
    time = NaiveDateTime.utc_now  
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
      left_join: su in User, on: su.id == s.user_id,
      left_join: u in User, on: u.id == a.user_id,
      where: m.id == ^id,
      preload: [
        owner: o, 
        participants: p, 
        agenda_items: {a, [
          votes: v, 
          stack_entries: {s, [
            owner: su,
          ]}, 
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
    meeting_with_votes
  end

  @doc """
  Returns list of meetings for which:
  1. meeting.user_id == user_id or
  2. user has related invitations that 
    have been accepted
  """
  # TODO(mp 2/7): replace invitation status
  # string value check with enum value once
  # we have implemented enum
  def list_user_meetings(user_id) do
    owned_meetings = Repo.all(from m in Meeting, where: m.user_id == ^user_id, preload: [:owner])

    accepted_invitations = Repo.all(from i in Invitation, where: i.invitee_id == ^user_id and i.status == "ACCEPTED")
    invited_meetings = Enum.map(accepted_invitations, fn i -> 
      Repo.get(Meeting, i.meeting_id) 
      |> Repo.preload([:owner]) end)

    owned_meetings ++ invited_meetings
  end

  @doc """
  Gets a single meeting.

  Raises `Ecto.NoResultsError` if the Meeting does not exist.

  """
  def get_meeting!(id), do: Repo.get!(Meeting, id)

  @doc """
  Creates a meeting.

  """
  def create_meeting(attrs \\ %{}) do
    %Meeting{}
    |> Meeting.creation_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a meeting.

  """
  def update_meeting(%Meeting{} = meeting, attrs) do
    result = 
      meeting
      |> Meeting.changeset(attrs)
      |> Repo.update()

    meeting = Repo.get(Meeting, meeting.id)
      |> Repo.preload([:owner])

    json = MfacWeb.MeetingView.render("meeting_details.json", %{meeting: meeting})
    send_broadcast("update_meeting_details", meeting.id, %{meeting: json})

    result
  end

  @doc """
  Deletes a Meeting.

  """
  def delete_meeting(%Meeting{} = meeting) do
    # Notify each user who was an invitee to
    # this meeting
    invitations = Repo.all(from i in Invitation, where: i.meeting_id == ^meeting.id)
    IO.inspect(invitations, label: "INVITATIONS")
    result = Repo.delete(meeting)
    send_broadcast("remove_meeting", meeting.id, %{meeting_id: meeting.id})
    Enum.each(invitations, fn(i) -> 
      MfacWeb.UserChannel.broadcast_event("remove_invitation", i.invitee_id, %{invitation_id: i.id})
    end)
    result
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking meeting changes.

  """
  def change_meeting(%Meeting{} = meeting) do
    Meeting.changeset(meeting, %{})
  end

  

  @doc """
  Returns the list of agendaitems.

  """
  def list_agenda_items do
    Repo.all(AgendaItem)
  end

  @doc """
  Gets a single agenda_item.

  Raises `Ecto.NoResultsError` if the Agenda item does not exist.

  """
  def get_agenda_item!(id), do: Repo.get!(AgendaItem, id)

  @doc """
  Creates a agenda_item.  Broadcasts event to
  related meeting room

  """
  # TODO(MP 2/7): consolidate complex queries
  # into one place, instead of having 
  # to replicate same code as in below
  # create and update funcs
  def create_agenda_item(attrs \\ %{}) do
    result = 
      %AgendaItem{}
      |> AgendaItem.changeset(attrs)
      |> Repo.insert()
    {status, agenda_item} = result
    query = from a in AgendaItem,
      left_join: u in User, on: u.id == a.user_id,
      left_join: v in AgendaItemVote, on: v.agenda_item_id == a.id,
      left_join: s in StackEntry, on: s.agenda_item_id == a.id,
      left_join: so in User, on: so.id == s.user_id,
      where: a.id == ^agenda_item.id,
      preload: [
        owner: u,
        votes: v,
        stack_entries: {s, [
          owner: so,  
        ]},
      ]
    agenda_item = List.first(Repo.all(query))
    json = MfacWeb.AgendaItemView.render("agenda_item_with_votes.json", agenda_item)
    send_broadcast("add_agenda_item", agenda_item.meeting_id, %{agenda_item: json})
    result
  end

  


  @doc """
  Updates a agenda_item.

  """
  def update_agenda_item(%AgendaItem{} = agenda_item, attrs) do
    result = 
      agenda_item
      |> AgendaItem.changeset(attrs)
      |> Repo.update()
    {status, agenda_item} = result
    query = from a in AgendaItem,
      left_join: u in User, on: u.id == a.user_id,
      left_join: v in AgendaItemVote, on: v.agenda_item_id == a.id,
      left_join: s in StackEntry, on: s.agenda_item_id == a.id,
      left_join: so in User, on: so.id == s.user_id,
      where: a.id == ^agenda_item.id,
      preload: [
        owner: u,
        votes: v,
        stack_entries: {s, [
          owner: so,  
        ]},
      ]
    agenda_item = List.first(Repo.all(query))
    json = MfacWeb.AgendaItemView.render("agenda_item_with_votes.json", agenda_item)
    send_broadcast("update_agenda_item", agenda_item.meeting_id, %{agenda_item: json})
    result
  end

  @doc """
  Deletes a AgendaItem.

  """
  def delete_agenda_item(%AgendaItem{} = agenda_item) do
    result = Repo.delete(agenda_item)
    send_broadcast("remove_agenda_item", agenda_item.meeting_id, %{agenda_item_id: agenda_item.id})
    result
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking agenda_item changes.

  """
  def change_agenda_item(%AgendaItem{} = agenda_item) do
    AgendaItem.changeset(agenda_item, %{})
  end


  # TODO(JA): ask mark what the user_vote key should return and handle that formatting here
  # TODO(MP 2/7): I think maybe this should be
  # moved to a different location.  Moved it to
  # AgendaItemView.
  # *** user_vote key should be either "UP",
  # "DOWN", "MEH", or nil, depending on what 
  # type of vote the requesting user cast for
  # this agenda item.  It's  context dependent,
  # so in the case where we are updating vote
  # counts in a broadcast 
  # (and not to a specific user), returned
  # data should not have a "user_vote" key.
  # Client is set up to handle this.
  defp format_votes(votes) do
    Enum.reduce(votes, %{up: 0, down: 0, meh: 0}, fn(vote, acc) -> 
      case vote.vote_type do
        "UP" -> 
          Map.put(acc, :up, Map.get(acc, :up) + 1)
        "DOWN" ->
          Map.put(acc, :down, Map.get(acc, :down) + 1)
        "MEH" ->
          Map.put(acc, :meh, Map.get(acc, :meh) + 1)
      end  
    end)
  end

  defp format_votes(votes, user_id) do
    result = Enum.reduce(votes, %{up: 0, down: 0, meh: 0, user_vote: nil}, fn(vote, acc) -> 

      case vote.vote_type do
        "UP" -> 
          #IO.puts("IS UP")
          Map.put(acc, :up, Map.get(acc, :up) + 1)
        "DOWN" ->
          #IO.puts("IS DOWN")
          Map.put(acc, :down, Map.get(acc, :down) + 1)
        "MEH" ->
          #IO.puts("IS MEH")
          Map.put(acc, :meh, Map.get(acc, :meh) + 1)
      end 
    end)
    filtered = Enum.filter(votes, fn v -> v.user_id == user_id end)
    if List.first(filtered) != nil do
      item = List.first(filtered)
      result = Map.put(result, :user_vote, item.vote_type)
    end
    #IO.inspect(result, label: "RESULT")
    result
  end

  @doc """
    Accepts agenda_item or agenda_items with preloaded votes as and argument
    and returns the same struct or structs with the votes key set to the
    formatted votes accumulation needed by the client side application.
  """
  def get_formatted_agenda_item_votes(agenda_item) when is_list(agenda_item) do
    Enum.map(agenda_item, fn item -> 
      Map.put(item, :votes, format_votes(item.votes))
    end)
  end

  def get_formatted_agenda_item_votes(agenda_item) when is_map(agenda_item) do
    Map.put(agenda_item, :votes, format_votes(agenda_item.votes))
  end

  def get_formatted_agenda_item_votes(agenda_item, user_id) when is_list(agenda_item) do
    Enum.map(agenda_item, fn item -> 
      Map.put(item, :votes, format_votes(item.votes, user_id))
    end)
  end



  alias Mfac.Meetings.AgendaItemVote

  @doc """
  Returns the list of agendaitemvotes.

  """
  def list_agenda_item_votes do
    Repo.all(AgendaItemVote)
  end

  @doc """
  Gets a single agenda_item_vote.

  Raises `Ecto.NoResultsError` if the Agenda item vote does not exist.

  """
  def get_agenda_item_vote!(id), do: Repo.get!(AgendaItemVote, id)

  @doc """
  Creates a agenda_item_vote.

  """
  def create_agenda_item_vote(attrs \\ %{}) do
    result = 
      %AgendaItemVote{}
      |> AgendaItemVote.changeset(attrs)
      |> Repo.insert()

    {status, vote} = result
    #IO.inspect(vote, label: "CREATE VOTE")
    votes = Repo.all(from a in AgendaItemVote, where: a.agenda_item_id == ^vote.agenda_item_id)
    agenda_item = Repo.get(AgendaItem, vote.agenda_item_id)
    formatted_votes = format_votes(votes)
    payload = %{
      votes: formatted_votes,
      agenda_item_id: agenda_item.id,
    }
    send_broadcast("update_agenda_item_votes", agenda_item.meeting_id, payload)

    result
  end

  @doc """
  Updates a agenda_item_vote.

  """
  def update_agenda_item_vote(%AgendaItemVote{} = agenda_item_vote, attrs) do
    result = 
      agenda_item_vote
      |> AgendaItemVote.changeset(attrs)
      |> Repo.update()

    {status, vote} = result
    #IO.inspect(vote, label: "UPDATE VOTE")
    votes = Repo.all(from a in AgendaItemVote, where: a.agenda_item_id == ^vote.agenda_item_id)
    agenda_item = Repo.get(AgendaItem, vote.agenda_item_id)
    formatted_votes = format_votes(votes)
    payload = %{
      votes: formatted_votes,
      agenda_item_id: agenda_item.id,
    }
    send_broadcast("update_agenda_item_votes", agenda_item.meeting_id, payload)

    result
  end

  @doc """
  Deletes a AgendaItemVote.

  """
  def delete_agenda_item_vote(%AgendaItemVote{} = agenda_item_vote) do
    result = Repo.delete(agenda_item_vote)

    vote = agenda_item_vote
    #IO.inspect(vote, label: "UPDATE VOTE")
    votes = Repo.all(from a in AgendaItemVote, where: a.agenda_item_id == ^vote.agenda_item_id)
    agenda_item = Repo.get(AgendaItem, vote.agenda_item_id)
    formatted_votes = format_votes(votes)
    payload = %{
      votes: formatted_votes,
      agenda_item_id: agenda_item.id,
    }
    send_broadcast("update_agenda_item_votes", agenda_item.meeting_id, payload)

    result
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking agenda_item_vote changes.

  """
  def change_agenda_item_vote(%AgendaItemVote{} = agenda_item_vote) do
    AgendaItemVote.changeset(agenda_item_vote, %{})
  end

  alias Mfac.Meetings.StackEntry

  @doc """
  Returns the list of stack_entries.

  """
  def list_stack_entries do
    Repo.all(StackEntry)
  end

  @doc """
  Gets a single stack_entry.

  Raises `Ecto.NoResultsError` if the Stack entry does not exist.

  """
  def get_stack_entry!(id), do: Repo.get!(StackEntry, id)

  @doc """
  Creates a stack_entry.

  """
  def create_stack_entry(attrs \\ %{}) do
    result =
      %StackEntry{}
      |> StackEntry.changeset(attrs)
      |> Repo.insert()

    {status, stack_entry} = result
    # Need to query for agenda_item because
    # we need to know meeting_id for broadcast
    # TODO(MP 2/8): currently querying
    # stack_entries twice, one time in
    # controller to see if user is already
    # on stack, and another time here.
    # Should prob try to consolidate
    agenda_item = Repo.get(AgendaItem, stack_entry.agenda_item_id)
    stack_entries = Repo.all(from s in StackEntry, where: s.agenda_item_id == ^agenda_item.id, preload: [:owner])
    data = %{
      agenda_item_id: agenda_item.id,
      stack_entries: MfacWeb.StackEntryView.render("index.json", stack_entries: stack_entries),
    }
    send_broadcast("update_stack_entries", agenda_item.meeting_id, data)
    result
  end

  @doc """
  Updates a stack_entry.

  """
  def update_stack_entry(%StackEntry{} = stack_entry, attrs) do
    stack_entry
    |> StackEntry.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a StackEntry.

  """
  def delete_stack_entry(%StackEntry{} = stack_entry) do
    result = Repo.delete(stack_entry)
    # Need to query for agenda_item because
    # we need to know meeting_id for broadcast
    # TODO(MP 2/8): currently querying
    # stack_entries twice, one time in
    # controller to see if user is already
    # on stack, and another time here.
    # Should prob try to consolidate
    agenda_item = Repo.get(AgendaItem, stack_entry.agenda_item_id)
    stack_entries = Repo.all(from s in StackEntry, where: s.agenda_item_id == ^agenda_item.id, preload: [:owner])
    data = %{
      agenda_item_id: agenda_item.id,
      stack_entries: MfacWeb.StackEntryView.render("index.json", stack_entries: stack_entries),
    }
    send_broadcast("update_stack_entries", agenda_item.meeting_id, data)
    result
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking stack_entry changes.

  """
  def change_stack_entry(%StackEntry{} = stack_entry) do
    StackEntry.changeset(stack_entry, %{})
  end

  alias Mfac.Meetings.Invitation

  @doc """
  Returns the list of invitations.

  """
  def list_invitations do
    Repo.all(Invitation)
  end

  @doc """
  Gets a single invitation.

  Raises `Ecto.NoResultsError` if the Invitation does not exist.

  """
  def get_invitation!(id), do: Repo.get!(Invitation, id)

  @doc """
  Creates a invitation.

  """
  def create_invitation(attrs \\ %{}) do
    result = 
      %Invitation{}
      |> Invitation.changeset(attrs)
      |> Repo.insert()
    {status, invitation} = result
    invitation = Repo.get(Invitation, invitation.id)
      |> Repo.preload([:inviter, :invitee, :meeting])

    json = MfacWeb.InvitationView.render("invitation.json", %{invitation: invitation})
    # broadcast to meeting
    send_broadcast("add_invitation", invitation.meeting_id, %{invitation: json})
    # broadcast to invitee (really should
    # just send to his/her specific channel)
    MfacWeb.UserChannel.broadcast_event("add_invitation", invitation.invitee_id, %{invitation: json})

    result
  end

  @doc """
  Updates a invitation.

  """
  def update_invitation(%Invitation{} = invitation, attrs) do
    result = 
      invitation
      |> Invitation.changeset(attrs)
      |> Repo.update()

    invitation = Repo.get(Invitation, invitation.id)
      |> Repo.preload([:inviter, :invitee, :meeting])
    json = MfacWeb.InvitationView.render("invitation.json", %{invitation: invitation})
    # broadcast to meeting
    send_broadcast("update_invitation", invitation.meeting_id, %{invitation: json})
    # broadcast to invitee (really should
    # just send to his/her specific channel)
    MfacWeb.UserChannel.broadcast_event("update_invitation", invitation.invitee_id, %{invitation: json})

    result
  end

  @doc """
  Deletes a Invitation.

  """
  def delete_invitation(%Invitation{} = invitation) do
    result = Repo.delete(invitation)
    send_broadcast("remove_invitation", invitation.meeting_id, %{invitation_id: invitation.id})
    # broadcast to invitee (really should
    # just send to his/her specific channel)
    MfacWeb.UserChannel.broadcast_event("remove_invitation", invitation.invitee_id, %{invitation_id: invitation.id})
    result
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking invitation changes.

  """
  def change_invitation(%Invitation{} = invitation) do
    Invitation.changeset(invitation, %{})
  end

  alias Mfac.Meetings.Participant

  @doc """
  Returns the list of participants.

  """
  def list_participants do
    Repo.all(Participant)
  end

  @doc """
  Gets a single participant.

  Raises `Ecto.NoResultsError` if the Participant does not exist.

  """
  def get_participant!(id), do: Repo.get!(Participant, id)

  @doc """
  Creates a participant.

  """
  def create_participant(attrs \\ %{}) do
    %Participant{}
    |> Participant.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a participant.

  """
  def update_participant(%Participant{} = participant, attrs) do
    participant
    |> Participant.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Participant.

  """
  def delete_participant(%Participant{} = participant) do
    Repo.delete(participant)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking participant changes.

  """
  def change_participant(%Participant{} = participant) do
    Participant.changeset(participant, %{})
  end
end
