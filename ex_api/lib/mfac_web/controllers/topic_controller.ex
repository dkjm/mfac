defmodule MfacWeb.TopicController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.Topic

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    topic = Meetings.list_topics() |> IO.inspect(label: "topic")
    render(conn, "index.json", topic: topic)
  end

  def create(conn, %{"topic" => topic_params}) do
    with {:ok, %Topic{} = topic} <- Meetings.create_topic(topic_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", topic_path(conn, :show, topic))
      |> render("show.json", topic: topic)
    end
  end

  def show(conn, %{"id" => id}) do
    topic = Meetings.get_topic!(id)
    render(conn, "show.json", topic: topic)
  end

  def update(conn, %{"id" => id, "topic" => topic_params}) do
    topic = Meetings.get_topic!(id)

    with {:ok, %Topic{} = topic} <- Meetings.update_topic(topic, topic_params) do
      render(conn, "show.json", topic: topic)
    end
  end

  def delete(conn, %{"id" => id}) do
    topic = Meetings.get_topic!(id)
    with {:ok, %Topic{}} <- Meetings.delete_topic(topic) do
      send_resp(conn, :no_content, "")
    end
  end
end
