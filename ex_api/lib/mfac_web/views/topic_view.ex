defmodule MfacWeb.TopicView do
  use MfacWeb, :view
  alias MfacWeb.TopicView

  def render("index.json", %{topic: topic}) do
    %{data: render_many(topic, TopicView, "topic.json")}
  end

  def render("show.json", %{topic: topic}) do
    %{data: render_one(topic, TopicView, "topic.json")}
  end

  def render("topic.json", %{topic: topic}) do
    %{id: topic.id,
      title: topic.title,
      body: topic.body,
      version: topic.version,
      topic_comments: render_many(topic.topic_comments, MfacWeb.TopicCommentView, "show.json"),
      owner: render_one(topic.owner, MfacWeb.UserView, "show.json")
    }
  end
end
