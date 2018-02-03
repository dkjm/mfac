defmodule MfacWeb.TopicCommentController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.TopicComment

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    topic_comment = Meetings.list_topic_comments()
    render(conn, "index.json", topic_comment: topic_comment)
  end

  def create(conn, %{"topic_comment" => topic_comment_params}) do
    with {:ok, %TopicComment{} = topic_comment} <- Meetings.create_topic_comment(topic_comment_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", topic_comment_path(conn, :show, topic_comment))
      |> render("show.json", topic_comment: topic_comment)
    end
  end

  def show(conn, %{"id" => id}) do
    topic_comment = Meetings.get_topic_comment!(id)
    render(conn, "show.json", topic_comment: topic_comment)
  end

  def update(conn, %{"id" => id, "topic_comment" => topic_comment_params}) do
    topic_comment = Meetings.get_topic_comment!(id)

    with {:ok, %TopicComment{} = topic_comment} <- Meetings.update_topic_comment(topic_comment, topic_comment_params) do
      render(conn, "show.json", topic_comment: topic_comment)
    end
  end

  def delete(conn, %{"id" => id}) do
    topic_comment = Meetings.get_topic_comment!(id)
    with {:ok, %TopicComment{}} <- Meetings.delete_topic_comment(topic_comment) do
      send_resp(conn, :no_content, "")
    end
  end
end
