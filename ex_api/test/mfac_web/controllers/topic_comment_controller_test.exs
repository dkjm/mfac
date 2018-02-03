defmodule MfacWeb.TopicCommentControllerTest do
  use MfacWeb.ConnCase

  alias Mfac.Meetings
  alias Mfac.Meetings.TopicComment

  @create_attrs %{body: "some body", version: 42}
  @update_attrs %{body: "some updated body", version: 43}
  @invalid_attrs %{body: nil, version: nil}

  def fixture(:topic_comment) do
    {:ok, topic_comment} = Meetings.create_topic_comment(@create_attrs)
    topic_comment
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all topic_comment", %{conn: conn} do
      conn = get conn, topic_comment_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create topic_comment" do
    test "renders topic_comment when data is valid", %{conn: conn} do
      conn = post conn, topic_comment_path(conn, :create), topic_comment: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, topic_comment_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "body" => "some body",
        "version" => 42}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, topic_comment_path(conn, :create), topic_comment: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update topic_comment" do
    setup [:create_topic_comment]

    test "renders topic_comment when data is valid", %{conn: conn, topic_comment: %TopicComment{id: id} = topic_comment} do
      conn = put conn, topic_comment_path(conn, :update, topic_comment), topic_comment: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, topic_comment_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "body" => "some updated body",
        "version" => 43}
    end

    test "renders errors when data is invalid", %{conn: conn, topic_comment: topic_comment} do
      conn = put conn, topic_comment_path(conn, :update, topic_comment), topic_comment: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete topic_comment" do
    setup [:create_topic_comment]

    test "deletes chosen topic_comment", %{conn: conn, topic_comment: topic_comment} do
      conn = delete conn, topic_comment_path(conn, :delete, topic_comment)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, topic_comment_path(conn, :show, topic_comment)
      end
    end
  end

  defp create_topic_comment(_) do
    topic_comment = fixture(:topic_comment)
    {:ok, topic_comment: topic_comment}
  end
end
