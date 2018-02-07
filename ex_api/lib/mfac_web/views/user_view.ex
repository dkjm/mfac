defmodule MfacWeb.UserView do
  use MfacWeb, :view
  alias MfacWeb.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("sign_in.json", %{user: user, token: token}) do
   %{
      user_data: render_one(user, UserView, "user.json"),
      token: token,
      meeting_invitations: user.invitations,
      contacts: []
    }
    
  end

  def render("user.json", %{user: user}) do
    full_name = "#{user.first_name} #{user.last_name}"
    %{id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      middle_name: user.middle_name,
      full_name: full_name,
      is_active: user.is_active}
  end

  def render("user_data.json", %{user_data: data}) do
    %{
      user_data: render_one(data.user_data, UserView, "user.json"), 
      meeting_invitations: data.meeting_invitations,
      contacts: data.contacts
    }
  end

  def render("user_simple.json", %{user: user}) do
    full_name = "#{user.first_name} #{user.last_name}"
    %{id: user.id,
      full_name: full_name}
  end
end
