defmodule Mfac.Meetings do
  @moduledoc """
  The Meetings context.
  """

  import Ecto.Query, warn: false
  alias Mfac.Repo


  alias Mfac.Meetings.Meeting

  @doc """
  Returns the list of meetings.

  ## Examples

      iex> list_meetings()
      [%Meeting{}, ...]

  """
  def list_meetings do
    Repo.all(Meeting)
  end

  @doc """
  Gets a single meeting.

  Raises `Ecto.NoResultsError` if the Meeting does not exist.

  ## Examples

      iex> get_meeting!(123)
      %Meeting{}

      iex> get_meeting!(456)
      ** (Ecto.NoResultsError)

  """
  def get_meeting!(id), do: Repo.get!(Meeting, id)

  @doc """
  Creates a meeting.

  ## Examples

      iex> create_meeting(%{field: value})
      {:ok, %Meeting{}}

      iex> create_meeting(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_meeting(attrs \\ %{}) do
    %Meeting{}
    |> Meeting.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a meeting.

  ## Examples

      iex> update_meeting(meeting, %{field: new_value})
      {:ok, %Meeting{}}

      iex> update_meeting(meeting, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_meeting(%Meeting{} = meeting, attrs) do
    meeting
    |> Meeting.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Meeting.

  ## Examples

      iex> delete_meeting(meeting)
      {:ok, %Meeting{}}

      iex> delete_meeting(meeting)
      {:error, %Ecto.Changeset{}}

  """
  def delete_meeting(%Meeting{} = meeting) do
    Repo.delete(meeting)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking meeting changes.

  ## Examples

      iex> change_meeting(meeting)
      %Ecto.Changeset{source: %Meeting{}}

  """
  def change_meeting(%Meeting{} = meeting) do
    Meeting.changeset(meeting, %{})
  end

  alias Mfac.Meetings.AgendaItem

  @doc """
  Returns the list of agendaitems.

  ## Examples

      iex> list_agendaitems()
      [%AgendaItem{}, ...]

  """
  def list_agendaitems do
    Repo.all(AgendaItem)
  end

  @doc """
  Gets a single agenda_item.

  Raises `Ecto.NoResultsError` if the Agenda item does not exist.

  ## Examples

      iex> get_agenda_item!(123)
      %AgendaItem{}

      iex> get_agenda_item!(456)
      ** (Ecto.NoResultsError)

  """
  def get_agenda_item!(id), do: Repo.get!(AgendaItem, id)

  @doc """
  Creates a agenda_item.

  ## Examples

      iex> create_agenda_item(%{field: value})
      {:ok, %AgendaItem{}}

      iex> create_agenda_item(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  # def create_agenda_item(attrs \\ %{}) do
  #   %AgendaItem{}
  #   |> AgendaItem.changeset(attrs)
  #   |> Repo.insert()
  #   |> IO.inspect(label: "ITEM")
  # end

  # def create_agenda_item(attrs \\ %{}) do
  #   %AgendaItem{}
  #   |> AgendaItem.changeset(attrs)
  #   |> Repo.insert()
  #   |> IO.inspect(label: "REPO RESULT")
  #   |> send_broadcast
  # end

  def create_agenda_item(attrs \\ %{}) do
    result = 
      %AgendaItem{}
      |> AgendaItem.changeset(attrs)
      |> Repo.insert()
      |> IO.inspect(label: "REPO RESULT")
      |> send_broadcast
  end

  defp send_broadcast(result) do
    {status, agenda_item} = result
    IO.inspect(status, label: "STATUS=======")
    IO.inspect(status, label: "STATUS=======")
    MfacWeb.MeetingChannel.broadcast_event(agenda_item)
    result
    # IO.inspect(agenda_item, label: "ITEM=======")
  end
  #   room = "meetings:#{agenda_item.meeting_id}"
  #   agenda_item_json = MfacWeb.AgendaItemView.render("show.json", %{agenda_item: agenda_item})
  #   MeetingChannel.Endpoint.broadcast(room, "add_agenda_item", agenda_item_json)
  # end

  @doc """
  Updates a agenda_item.

  ## Examples

      iex> update_agenda_item(agenda_item, %{field: new_value})
      {:ok, %AgendaItem{}}

      iex> update_agenda_item(agenda_item, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_agenda_item(%AgendaItem{} = agenda_item, attrs) do
    agenda_item
    |> AgendaItem.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a AgendaItem.

  ## Examples

      iex> delete_agenda_item(agenda_item)
      {:ok, %AgendaItem{}}

      iex> delete_agenda_item(agenda_item)
      {:error, %Ecto.Changeset{}}

  """
  def delete_agenda_item(%AgendaItem{} = agenda_item) do
    Repo.delete(agenda_item)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking agenda_item changes.

  ## Examples

      iex> change_agenda_item(agenda_item)
      %Ecto.Changeset{source: %AgendaItem{}}

  """
  def change_agenda_item(%AgendaItem{} = agenda_item) do
    AgendaItem.changeset(agenda_item, %{})
  end

  alias Mfac.Meetings.AgendaItemVote

  @doc """
  Returns the list of agendaitemvotes.

  ## Examples

      iex> list_agendaitemvotes()
      [%AgendaItemVote{}, ...]

  """
  def list_agendaitemvotes do
    Repo.all(AgendaItemVote)
  end

  @doc """
  Gets a single agenda_item_vote.

  Raises `Ecto.NoResultsError` if the Agenda item vote does not exist.

  ## Examples

      iex> get_agenda_item_vote!(123)
      %AgendaItemVote{}

      iex> get_agenda_item_vote!(456)
      ** (Ecto.NoResultsError)

  """
  def get_agenda_item_vote!(id), do: Repo.get!(AgendaItemVote, id)

  @doc """
  Creates a agenda_item_vote.

  ## Examples

      iex> create_agenda_item_vote(%{field: value})
      {:ok, %AgendaItemVote{}}

      iex> create_agenda_item_vote(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_agenda_item_vote(attrs \\ %{}) do
    %AgendaItemVote{}
    |> AgendaItemVote.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a agenda_item_vote.

  ## Examples

      iex> update_agenda_item_vote(agenda_item_vote, %{field: new_value})
      {:ok, %AgendaItemVote{}}

      iex> update_agenda_item_vote(agenda_item_vote, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_agenda_item_vote(%AgendaItemVote{} = agenda_item_vote, attrs) do
    agenda_item_vote
    |> AgendaItemVote.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a AgendaItemVote.

  ## Examples

      iex> delete_agenda_item_vote(agenda_item_vote)
      {:ok, %AgendaItemVote{}}

      iex> delete_agenda_item_vote(agenda_item_vote)
      {:error, %Ecto.Changeset{}}

  """
  def delete_agenda_item_vote(%AgendaItemVote{} = agenda_item_vote) do
    Repo.delete(agenda_item_vote)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking agenda_item_vote changes.

  ## Examples

      iex> change_agenda_item_vote(agenda_item_vote)
      %Ecto.Changeset{source: %AgendaItemVote{}}

  """
  def change_agenda_item_vote(%AgendaItemVote{} = agenda_item_vote) do
    AgendaItemVote.changeset(agenda_item_vote, %{})
  end

  alias Mfac.Meetings.StackEntry

  @doc """
  Returns the list of stack_entries.

  ## Examples

      iex> list_stack_entries()
      [%StackEntry{}, ...]

  """
  def list_stack_entries do
    Repo.all(StackEntry)
  end

  @doc """
  Gets a single stack_entry.

  Raises `Ecto.NoResultsError` if the Stack entry does not exist.

  ## Examples

      iex> get_stack_entry!(123)
      %StackEntry{}

      iex> get_stack_entry!(456)
      ** (Ecto.NoResultsError)

  """
  def get_stack_entry!(id), do: Repo.get!(StackEntry, id)

  @doc """
  Creates a stack_entry.

  ## Examples

      iex> create_stack_entry(%{field: value})
      {:ok, %StackEntry{}}

      iex> create_stack_entry(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_stack_entry(attrs \\ %{}) do
    %StackEntry{}
    |> StackEntry.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a stack_entry.

  ## Examples

      iex> update_stack_entry(stack_entry, %{field: new_value})
      {:ok, %StackEntry{}}

      iex> update_stack_entry(stack_entry, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_stack_entry(%StackEntry{} = stack_entry, attrs) do
    stack_entry
    |> StackEntry.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a StackEntry.

  ## Examples

      iex> delete_stack_entry(stack_entry)
      {:ok, %StackEntry{}}

      iex> delete_stack_entry(stack_entry)
      {:error, %Ecto.Changeset{}}

  """
  def delete_stack_entry(%StackEntry{} = stack_entry) do
    Repo.delete(stack_entry)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking stack_entry changes.

  ## Examples

      iex> change_stack_entry(stack_entry)
      %Ecto.Changeset{source: %StackEntry{}}

  """
  def change_stack_entry(%StackEntry{} = stack_entry) do
    StackEntry.changeset(stack_entry, %{})
  end

  alias Mfac.Meetings.Invitation

  @doc """
  Returns the list of invitations.

  ## Examples

      iex> list_invitations()
      [%Invitation{}, ...]

  """
  def list_invitations do
    Repo.all(Invitation)
  end

  @doc """
  Gets a single invitation.

  Raises `Ecto.NoResultsError` if the Invitation does not exist.

  ## Examples

      iex> get_invitation!(123)
      %Invitation{}

      iex> get_invitation!(456)
      ** (Ecto.NoResultsError)

  """
  def get_invitation!(id), do: Repo.get!(Invitation, id)

  @doc """
  Creates a invitation.

  ## Examples

      iex> create_invitation(%{field: value})
      {:ok, %Invitation{}}

      iex> create_invitation(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_invitation(attrs \\ %{}) do
    %Invitation{}
    |> Invitation.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a invitation.

  ## Examples

      iex> update_invitation(invitation, %{field: new_value})
      {:ok, %Invitation{}}

      iex> update_invitation(invitation, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_invitation(%Invitation{} = invitation, attrs) do
    invitation
    |> Invitation.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Invitation.

  ## Examples

      iex> delete_invitation(invitation)
      {:ok, %Invitation{}}

      iex> delete_invitation(invitation)
      {:error, %Ecto.Changeset{}}

  """
  def delete_invitation(%Invitation{} = invitation) do
    Repo.delete(invitation)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking invitation changes.

  ## Examples

      iex> change_invitation(invitation)
      %Ecto.Changeset{source: %Invitation{}}

  """
  def change_invitation(%Invitation{} = invitation) do
    Invitation.changeset(invitation, %{})
  end

  alias Mfac.Meetings.Participant

  @doc """
  Returns the list of participants.

  ## Examples

      iex> list_participants()
      [%Participant{}, ...]

  """
  def list_participants do
    Repo.all(Participant)
  end

  @doc """
  Gets a single participant.

  Raises `Ecto.NoResultsError` if the Participant does not exist.

  ## Examples

      iex> get_participant!(123)
      %Participant{}

      iex> get_participant!(456)
      ** (Ecto.NoResultsError)

  """
  def get_participant!(id), do: Repo.get!(Participant, id)

  @doc """
  Creates a participant.

  ## Examples

      iex> create_participant(%{field: value})
      {:ok, %Participant{}}

      iex> create_participant(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_participant(attrs \\ %{}) do
    %Participant{}
    |> Participant.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a participant.

  ## Examples

      iex> update_participant(participant, %{field: new_value})
      {:ok, %Participant{}}

      iex> update_participant(participant, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_participant(%Participant{} = participant, attrs) do
    participant
    |> Participant.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Participant.

  ## Examples

      iex> delete_participant(participant)
      {:ok, %Participant{}}

      iex> delete_participant(participant)
      {:error, %Ecto.Changeset{}}

  """
  def delete_participant(%Participant{} = participant) do
    Repo.delete(participant)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking participant changes.

  ## Examples

      iex> change_participant(participant)
      %Ecto.Changeset{source: %Participant{}}

  """
  def change_participant(%Participant{} = participant) do
    Participant.changeset(participant, %{})
  end
end
