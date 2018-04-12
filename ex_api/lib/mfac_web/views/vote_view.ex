defmodule MfacWeb.VoteView do
  use MfacWeb, :view
  alias MfacWeb.VoteView

  def render("index.json", %{votes: votes}) do
    %{data: render_many(votes, VoteView, "vote_with_owner.json")}
  end

  def render("show.json", %{vote: vote}) do
    %{data: render_one(vote, VoteView, "vote.json")}
  end

  def render("vote.json", %{vote: vote}) do
    %{id: vote.id,
      value: vote.value,
      version: vote.version}
  end

  def render("vote_with_owner.json", %{vote: vote}) do
    %{id: vote.id,
      value: vote.value,
      version: vote.version,
      owner: render_one(vote.owner, MfacWeb.UserView, "user_simple.json")
    }
  end

end
