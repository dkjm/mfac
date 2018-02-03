defmodule MfacWeb.TopicCommentView do
  use MfacWeb, :view
  alias MfacWeb.TopicCommentView

  def render("index.json", %{topic_comment: topic_comment}) do
    %{data: render_many(topic_comment, TopicCommentView, "topic_comment.json")}
  end

  def render("show.json", %{topic_comment: topic_comment}) do
    %{data: render_one(topic_comment, TopicCommentView, "topic_comment.json")}
  end

  def render("topic_comment.json", %{topic_comment: topic_comment}) do
    %{id: topic_comment.id,
      body: topic_comment.body,
      version: topic_comment.version}
  end
end
