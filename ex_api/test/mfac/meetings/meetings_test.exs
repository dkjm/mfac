defmodule Mfac.MeetingsTest do
  use Mfac.DataCase

  alias Mfac.Meetings

  describe "topic" do
    alias Mfac.Meetings.Topic

    @valid_attrs %{body: "some body", title: "some title", version: "some version"}
    @update_attrs %{body: "some updated body", title: "some updated title", version: "some updated version"}
    @invalid_attrs %{body: nil, title: nil, version: nil}

    def topic_fixture(attrs \\ %{}) do
      {:ok, topic} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Meetings.create_topic()

      topic
    end

    test "list_topic/0 returns all topic" do
      topic = topic_fixture()
      assert Meetings.list_topic() == [topic]
    end

    test "get_topic!/1 returns the topic with given id" do
      topic = topic_fixture()
      assert Meetings.get_topic!(topic.id) == topic
    end

    test "create_topic/1 with valid data creates a topic" do
      assert {:ok, %Topic{} = topic} = Meetings.create_topic(@valid_attrs)
      assert topic.body == "some body"
      assert topic.title == "some title"
      assert topic.version == "some version"
    end

    test "create_topic/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Meetings.create_topic(@invalid_attrs)
    end

    test "update_topic/2 with valid data updates the topic" do
      topic = topic_fixture()
      assert {:ok, topic} = Meetings.update_topic(topic, @update_attrs)
      assert %Topic{} = topic
      assert topic.body == "some updated body"
      assert topic.title == "some updated title"
      assert topic.version == "some updated version"
    end

    test "update_topic/2 with invalid data returns error changeset" do
      topic = topic_fixture()
      assert {:error, %Ecto.Changeset{}} = Meetings.update_topic(topic, @invalid_attrs)
      assert topic == Meetings.get_topic!(topic.id)
    end

    test "delete_topic/1 deletes the topic" do
      topic = topic_fixture()
      assert {:ok, %Topic{}} = Meetings.delete_topic(topic)
      assert_raise Ecto.NoResultsError, fn -> Meetings.get_topic!(topic.id) end
    end

    test "change_topic/1 returns a topic changeset" do
      topic = topic_fixture()
      assert %Ecto.Changeset{} = Meetings.change_topic(topic)
    end
  end

  describe "stack" do
    alias Mfac.Meetings.Stack

    @valid_attrs %{version: 42}
    @update_attrs %{version: 43}
    @invalid_attrs %{version: nil}

    def stack_fixture(attrs \\ %{}) do
      {:ok, stack} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Meetings.create_stack()

      stack
    end

    test "list_stack/0 returns all stack" do
      stack = stack_fixture()
      assert Meetings.list_stack() == [stack]
    end

    test "get_stack!/1 returns the stack with given id" do
      stack = stack_fixture()
      assert Meetings.get_stack!(stack.id) == stack
    end

    test "create_stack/1 with valid data creates a stack" do
      assert {:ok, %Stack{} = stack} = Meetings.create_stack(@valid_attrs)
      assert stack.version == 42
    end

    test "create_stack/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Meetings.create_stack(@invalid_attrs)
    end

    test "update_stack/2 with valid data updates the stack" do
      stack = stack_fixture()
      assert {:ok, stack} = Meetings.update_stack(stack, @update_attrs)
      assert %Stack{} = stack
      assert stack.version == 43
    end

    test "update_stack/2 with invalid data returns error changeset" do
      stack = stack_fixture()
      assert {:error, %Ecto.Changeset{}} = Meetings.update_stack(stack, @invalid_attrs)
      assert stack == Meetings.get_stack!(stack.id)
    end

    test "delete_stack/1 deletes the stack" do
      stack = stack_fixture()
      assert {:ok, %Stack{}} = Meetings.delete_stack(stack)
      assert_raise Ecto.NoResultsError, fn -> Meetings.get_stack!(stack.id) end
    end

    test "change_stack/1 returns a stack changeset" do
      stack = stack_fixture()
      assert %Ecto.Changeset{} = Meetings.change_stack(stack)
    end
  end

  describe "topic_comment" do
    alias Mfac.Meetings.TopicComment

    @valid_attrs %{body: "some body", version: 42}
    @update_attrs %{body: "some updated body", version: 43}
    @invalid_attrs %{body: nil, version: nil}

    def topic_comment_fixture(attrs \\ %{}) do
      {:ok, topic_comment} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Meetings.create_topic_comment()

      topic_comment
    end

    test "list_topic_comment/0 returns all topic_comment" do
      topic_comment = topic_comment_fixture()
      assert Meetings.list_topic_comment() == [topic_comment]
    end

    test "get_topic_comment!/1 returns the topic_comment with given id" do
      topic_comment = topic_comment_fixture()
      assert Meetings.get_topic_comment!(topic_comment.id) == topic_comment
    end

    test "create_topic_comment/1 with valid data creates a topic_comment" do
      assert {:ok, %TopicComment{} = topic_comment} = Meetings.create_topic_comment(@valid_attrs)
      assert topic_comment.body == "some body"
      assert topic_comment.version == 42
    end

    test "create_topic_comment/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Meetings.create_topic_comment(@invalid_attrs)
    end

    test "update_topic_comment/2 with valid data updates the topic_comment" do
      topic_comment = topic_comment_fixture()
      assert {:ok, topic_comment} = Meetings.update_topic_comment(topic_comment, @update_attrs)
      assert %TopicComment{} = topic_comment
      assert topic_comment.body == "some updated body"
      assert topic_comment.version == 43
    end

    test "update_topic_comment/2 with invalid data returns error changeset" do
      topic_comment = topic_comment_fixture()
      assert {:error, %Ecto.Changeset{}} = Meetings.update_topic_comment(topic_comment, @invalid_attrs)
      assert topic_comment == Meetings.get_topic_comment!(topic_comment.id)
    end

    test "delete_topic_comment/1 deletes the topic_comment" do
      topic_comment = topic_comment_fixture()
      assert {:ok, %TopicComment{}} = Meetings.delete_topic_comment(topic_comment)
      assert_raise Ecto.NoResultsError, fn -> Meetings.get_topic_comment!(topic_comment.id) end
    end

    test "change_topic_comment/1 returns a topic_comment changeset" do
      topic_comment = topic_comment_fixture()
      assert %Ecto.Changeset{} = Meetings.change_topic_comment(topic_comment)
    end
  end

  describe "meetings" do
    alias Mfac.Meetings.Meeting

    @valid_attrs %{allotted_duration: 42, description: "some description", title: "some title", version: 42}
    @update_attrs %{allotted_duration: 43, description: "some updated description", title: "some updated title", version: 43}
    @invalid_attrs %{allotted_duration: nil, description: nil, title: nil, version: nil}

    def meeting_fixture(attrs \\ %{}) do
      {:ok, meeting} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Meetings.create_meeting()

      meeting
    end

    test "list_meetings/0 returns all meetings" do
      meeting = meeting_fixture()
      assert Meetings.list_meetings() == [meeting]
    end

    test "get_meeting!/1 returns the meeting with given id" do
      meeting = meeting_fixture()
      assert Meetings.get_meeting!(meeting.id) == meeting
    end

    test "create_meeting/1 with valid data creates a meeting" do
      assert {:ok, %Meeting{} = meeting} = Meetings.create_meeting(@valid_attrs)
      assert meeting.allotted_duration == 42
      assert meeting.description == "some description"
      assert meeting.title == "some title"
      assert meeting.version == 42
    end

    test "create_meeting/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Meetings.create_meeting(@invalid_attrs)
    end

    test "update_meeting/2 with valid data updates the meeting" do
      meeting = meeting_fixture()
      assert {:ok, meeting} = Meetings.update_meeting(meeting, @update_attrs)
      assert %Meeting{} = meeting
      assert meeting.allotted_duration == 43
      assert meeting.description == "some updated description"
      assert meeting.title == "some updated title"
      assert meeting.version == 43
    end

    test "update_meeting/2 with invalid data returns error changeset" do
      meeting = meeting_fixture()
      assert {:error, %Ecto.Changeset{}} = Meetings.update_meeting(meeting, @invalid_attrs)
      assert meeting == Meetings.get_meeting!(meeting.id)
    end

    test "delete_meeting/1 deletes the meeting" do
      meeting = meeting_fixture()
      assert {:ok, %Meeting{}} = Meetings.delete_meeting(meeting)
      assert_raise Ecto.NoResultsError, fn -> Meetings.get_meeting!(meeting.id) end
    end

    test "change_meeting/1 returns a meeting changeset" do
      meeting = meeting_fixture()
      assert %Ecto.Changeset{} = Meetings.change_meeting(meeting)
    end
  end

  describe "agendaitems" do
    alias Mfac.Meetings.AgendaItem

    @valid_attrs %{allotted_duration: 42, body: "some body", status: "some status", title: "some title", version: 42}
    @update_attrs %{allotted_duration: 43, body: "some updated body", status: "some updated status", title: "some updated title", version: 43}
    @invalid_attrs %{allotted_duration: nil, body: nil, status: nil, title: nil, version: nil}

    def agenda_item_fixture(attrs \\ %{}) do
      {:ok, agenda_item} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Meetings.create_agenda_item()

      agenda_item
    end

    test "list_agendaitems/0 returns all agendaitems" do
      agenda_item = agenda_item_fixture()
      assert Meetings.list_agendaitems() == [agenda_item]
    end

    test "get_agenda_item!/1 returns the agenda_item with given id" do
      agenda_item = agenda_item_fixture()
      assert Meetings.get_agenda_item!(agenda_item.id) == agenda_item
    end

    test "create_agenda_item/1 with valid data creates a agenda_item" do
      assert {:ok, %AgendaItem{} = agenda_item} = Meetings.create_agenda_item(@valid_attrs)
      assert agenda_item.allotted_duration == 42
      assert agenda_item.body == "some body"
      assert agenda_item.status == "some status"
      assert agenda_item.title == "some title"
      assert agenda_item.version == 42
    end

    test "create_agenda_item/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Meetings.create_agenda_item(@invalid_attrs)
    end

    test "update_agenda_item/2 with valid data updates the agenda_item" do
      agenda_item = agenda_item_fixture()
      assert {:ok, agenda_item} = Meetings.update_agenda_item(agenda_item, @update_attrs)
      assert %AgendaItem{} = agenda_item
      assert agenda_item.allotted_duration == 43
      assert agenda_item.body == "some updated body"
      assert agenda_item.status == "some updated status"
      assert agenda_item.title == "some updated title"
      assert agenda_item.version == 43
    end

    test "update_agenda_item/2 with invalid data returns error changeset" do
      agenda_item = agenda_item_fixture()
      assert {:error, %Ecto.Changeset{}} = Meetings.update_agenda_item(agenda_item, @invalid_attrs)
      assert agenda_item == Meetings.get_agenda_item!(agenda_item.id)
    end

    test "delete_agenda_item/1 deletes the agenda_item" do
      agenda_item = agenda_item_fixture()
      assert {:ok, %AgendaItem{}} = Meetings.delete_agenda_item(agenda_item)
      assert_raise Ecto.NoResultsError, fn -> Meetings.get_agenda_item!(agenda_item.id) end
    end

    test "change_agenda_item/1 returns a agenda_item changeset" do
      agenda_item = agenda_item_fixture()
      assert %Ecto.Changeset{} = Meetings.change_agenda_item(agenda_item)
    end
  end

  describe "agendaitemvotes" do
    alias Mfac.Meetings.AgendaItemVote

    @valid_attrs %{version: 42, vote_type: "some vote_type"}
    @update_attrs %{version: 43, vote_type: "some updated vote_type"}
    @invalid_attrs %{version: nil, vote_type: nil}

    def agenda_item_vote_fixture(attrs \\ %{}) do
      {:ok, agenda_item_vote} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Meetings.create_agenda_item_vote()

      agenda_item_vote
    end

    test "list_agendaitemvotes/0 returns all agendaitemvotes" do
      agenda_item_vote = agenda_item_vote_fixture()
      assert Meetings.list_agendaitemvotes() == [agenda_item_vote]
    end

    test "get_agenda_item_vote!/1 returns the agenda_item_vote with given id" do
      agenda_item_vote = agenda_item_vote_fixture()
      assert Meetings.get_agenda_item_vote!(agenda_item_vote.id) == agenda_item_vote
    end

    test "create_agenda_item_vote/1 with valid data creates a agenda_item_vote" do
      assert {:ok, %AgendaItemVote{} = agenda_item_vote} = Meetings.create_agenda_item_vote(@valid_attrs)
      assert agenda_item_vote.version == 42
      assert agenda_item_vote.vote_type == "some vote_type"
    end

    test "create_agenda_item_vote/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Meetings.create_agenda_item_vote(@invalid_attrs)
    end

    test "update_agenda_item_vote/2 with valid data updates the agenda_item_vote" do
      agenda_item_vote = agenda_item_vote_fixture()
      assert {:ok, agenda_item_vote} = Meetings.update_agenda_item_vote(agenda_item_vote, @update_attrs)
      assert %AgendaItemVote{} = agenda_item_vote
      assert agenda_item_vote.version == 43
      assert agenda_item_vote.vote_type == "some updated vote_type"
    end

    test "update_agenda_item_vote/2 with invalid data returns error changeset" do
      agenda_item_vote = agenda_item_vote_fixture()
      assert {:error, %Ecto.Changeset{}} = Meetings.update_agenda_item_vote(agenda_item_vote, @invalid_attrs)
      assert agenda_item_vote == Meetings.get_agenda_item_vote!(agenda_item_vote.id)
    end

    test "delete_agenda_item_vote/1 deletes the agenda_item_vote" do
      agenda_item_vote = agenda_item_vote_fixture()
      assert {:ok, %AgendaItemVote{}} = Meetings.delete_agenda_item_vote(agenda_item_vote)
      assert_raise Ecto.NoResultsError, fn -> Meetings.get_agenda_item_vote!(agenda_item_vote.id) end
    end

    test "change_agenda_item_vote/1 returns a agenda_item_vote changeset" do
      agenda_item_vote = agenda_item_vote_fixture()
      assert %Ecto.Changeset{} = Meetings.change_agenda_item_vote(agenda_item_vote)
    end
  end

  describe "stack_entries" do
    alias Mfac.Meetings.StackEntry

    @valid_attrs %{allotted_duration: 42, closed_at: "2010-04-17 14:00:00.000000Z", opened_at: "2010-04-17 14:00:00.000000Z", status: "some status", version: 42}
    @update_attrs %{allotted_duration: 43, closed_at: "2011-05-18 15:01:01.000000Z", opened_at: "2011-05-18 15:01:01.000000Z", status: "some updated status", version: 43}
    @invalid_attrs %{allotted_duration: nil, closed_at: nil, opened_at: nil, status: nil, version: nil}

    def stack_entry_fixture(attrs \\ %{}) do
      {:ok, stack_entry} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Meetings.create_stack_entry()

      stack_entry
    end

    test "list_stack_entries/0 returns all stack_entries" do
      stack_entry = stack_entry_fixture()
      assert Meetings.list_stack_entries() == [stack_entry]
    end

    test "get_stack_entry!/1 returns the stack_entry with given id" do
      stack_entry = stack_entry_fixture()
      assert Meetings.get_stack_entry!(stack_entry.id) == stack_entry
    end

    test "create_stack_entry/1 with valid data creates a stack_entry" do
      assert {:ok, %StackEntry{} = stack_entry} = Meetings.create_stack_entry(@valid_attrs)
      assert stack_entry.allotted_duration == 42
      assert stack_entry.closed_at == DateTime.from_naive!(~N[2010-04-17 14:00:00.000000Z], "Etc/UTC")
      assert stack_entry.opened_at == DateTime.from_naive!(~N[2010-04-17 14:00:00.000000Z], "Etc/UTC")
      assert stack_entry.status == "some status"
      assert stack_entry.version == 42
    end

    test "create_stack_entry/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Meetings.create_stack_entry(@invalid_attrs)
    end

    test "update_stack_entry/2 with valid data updates the stack_entry" do
      stack_entry = stack_entry_fixture()
      assert {:ok, stack_entry} = Meetings.update_stack_entry(stack_entry, @update_attrs)
      assert %StackEntry{} = stack_entry
      assert stack_entry.allotted_duration == 43
      assert stack_entry.closed_at == DateTime.from_naive!(~N[2011-05-18 15:01:01.000000Z], "Etc/UTC")
      assert stack_entry.opened_at == DateTime.from_naive!(~N[2011-05-18 15:01:01.000000Z], "Etc/UTC")
      assert stack_entry.status == "some updated status"
      assert stack_entry.version == 43
    end

    test "update_stack_entry/2 with invalid data returns error changeset" do
      stack_entry = stack_entry_fixture()
      assert {:error, %Ecto.Changeset{}} = Meetings.update_stack_entry(stack_entry, @invalid_attrs)
      assert stack_entry == Meetings.get_stack_entry!(stack_entry.id)
    end

    test "delete_stack_entry/1 deletes the stack_entry" do
      stack_entry = stack_entry_fixture()
      assert {:ok, %StackEntry{}} = Meetings.delete_stack_entry(stack_entry)
      assert_raise Ecto.NoResultsError, fn -> Meetings.get_stack_entry!(stack_entry.id) end
    end

    test "change_stack_entry/1 returns a stack_entry changeset" do
      stack_entry = stack_entry_fixture()
      assert %Ecto.Changeset{} = Meetings.change_stack_entry(stack_entry)
    end
  end

  describe "invitations" do
    alias Mfac.Meetings.Invitation

    @valid_attrs %{accepted_at: "2010-04-17 14:00:00.000000Z", declined_at: "2010-04-17 14:00:00.000000Z", status: "some status", verion: 42}
    @update_attrs %{accepted_at: "2011-05-18 15:01:01.000000Z", declined_at: "2011-05-18 15:01:01.000000Z", status: "some updated status", verion: 43}
    @invalid_attrs %{accepted_at: nil, declined_at: nil, status: nil, verion: nil}

    def invitation_fixture(attrs \\ %{}) do
      {:ok, invitation} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Meetings.create_invitation()

      invitation
    end

    test "list_invitations/0 returns all invitations" do
      invitation = invitation_fixture()
      assert Meetings.list_invitations() == [invitation]
    end

    test "get_invitation!/1 returns the invitation with given id" do
      invitation = invitation_fixture()
      assert Meetings.get_invitation!(invitation.id) == invitation
    end

    test "create_invitation/1 with valid data creates a invitation" do
      assert {:ok, %Invitation{} = invitation} = Meetings.create_invitation(@valid_attrs)
      assert invitation.accepted_at == DateTime.from_naive!(~N[2010-04-17 14:00:00.000000Z], "Etc/UTC")
      assert invitation.declined_at == DateTime.from_naive!(~N[2010-04-17 14:00:00.000000Z], "Etc/UTC")
      assert invitation.status == "some status"
      assert invitation.verion == 42
    end

    test "create_invitation/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Meetings.create_invitation(@invalid_attrs)
    end

    test "update_invitation/2 with valid data updates the invitation" do
      invitation = invitation_fixture()
      assert {:ok, invitation} = Meetings.update_invitation(invitation, @update_attrs)
      assert %Invitation{} = invitation
      assert invitation.accepted_at == DateTime.from_naive!(~N[2011-05-18 15:01:01.000000Z], "Etc/UTC")
      assert invitation.declined_at == DateTime.from_naive!(~N[2011-05-18 15:01:01.000000Z], "Etc/UTC")
      assert invitation.status == "some updated status"
      assert invitation.verion == 43
    end

    test "update_invitation/2 with invalid data returns error changeset" do
      invitation = invitation_fixture()
      assert {:error, %Ecto.Changeset{}} = Meetings.update_invitation(invitation, @invalid_attrs)
      assert invitation == Meetings.get_invitation!(invitation.id)
    end

    test "delete_invitation/1 deletes the invitation" do
      invitation = invitation_fixture()
      assert {:ok, %Invitation{}} = Meetings.delete_invitation(invitation)
      assert_raise Ecto.NoResultsError, fn -> Meetings.get_invitation!(invitation.id) end
    end

    test "change_invitation/1 returns a invitation changeset" do
      invitation = invitation_fixture()
      assert %Ecto.Changeset{} = Meetings.change_invitation(invitation)
    end
  end

  describe "participants" do
    alias Mfac.Meetings.Participant

    @valid_attrs %{joined_at: "2010-04-17 14:00:00.000000Z", left_at: "2010-04-17 14:00:00.000000Z", status: "some status", version: 42}
    @update_attrs %{joined_at: "2011-05-18 15:01:01.000000Z", left_at: "2011-05-18 15:01:01.000000Z", status: "some updated status", version: 43}
    @invalid_attrs %{joined_at: nil, left_at: nil, status: nil, version: nil}

    def participant_fixture(attrs \\ %{}) do
      {:ok, participant} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Meetings.create_participant()

      participant
    end

    test "list_participants/0 returns all participants" do
      participant = participant_fixture()
      assert Meetings.list_participants() == [participant]
    end

    test "get_participant!/1 returns the participant with given id" do
      participant = participant_fixture()
      assert Meetings.get_participant!(participant.id) == participant
    end

    test "create_participant/1 with valid data creates a participant" do
      assert {:ok, %Participant{} = participant} = Meetings.create_participant(@valid_attrs)
      assert participant.joined_at == DateTime.from_naive!(~N[2010-04-17 14:00:00.000000Z], "Etc/UTC")
      assert participant.left_at == DateTime.from_naive!(~N[2010-04-17 14:00:00.000000Z], "Etc/UTC")
      assert participant.status == "some status"
      assert participant.version == 42
    end

    test "create_participant/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Meetings.create_participant(@invalid_attrs)
    end

    test "update_participant/2 with valid data updates the participant" do
      participant = participant_fixture()
      assert {:ok, participant} = Meetings.update_participant(participant, @update_attrs)
      assert %Participant{} = participant
      assert participant.joined_at == DateTime.from_naive!(~N[2011-05-18 15:01:01.000000Z], "Etc/UTC")
      assert participant.left_at == DateTime.from_naive!(~N[2011-05-18 15:01:01.000000Z], "Etc/UTC")
      assert participant.status == "some updated status"
      assert participant.version == 43
    end

    test "update_participant/2 with invalid data returns error changeset" do
      participant = participant_fixture()
      assert {:error, %Ecto.Changeset{}} = Meetings.update_participant(participant, @invalid_attrs)
      assert participant == Meetings.get_participant!(participant.id)
    end

    test "delete_participant/1 deletes the participant" do
      participant = participant_fixture()
      assert {:ok, %Participant{}} = Meetings.delete_participant(participant)
      assert_raise Ecto.NoResultsError, fn -> Meetings.get_participant!(participant.id) end
    end

    test "change_participant/1 returns a participant changeset" do
      participant = participant_fixture()
      assert %Ecto.Changeset{} = Meetings.change_participant(participant)
    end
  end
end
