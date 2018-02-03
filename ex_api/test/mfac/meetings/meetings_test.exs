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
end
