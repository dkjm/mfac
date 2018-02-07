defmodule MfacWeb.UserController do
  use MfacWeb, :controller

  alias Mfac.Accounts
  alias Mfac.Accounts.User
  import Ecto.Query

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    users = Accounts.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    with {:ok, %User{} = user} <- Accounts.create_user(user_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", user_path(conn, :show, user))
      |> render("show.json", user: user)
    end
  end

  def show(conn, %{"id" => id}) do
    user = Accounts.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Accounts.get_user!(id)

    with {:ok, %User{} = user} <- Accounts.update_user(user, user_params) do
      render(conn, "show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Accounts.get_user!(id)
    with {:ok, %User{}} <- Accounts.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end

  defp authenticate(user, password) do
    case user do
      nil -> false
      _   -> Comeonin.Bcrypt.checkpw(password, user.hashed_password)
    end
  end

  # TODO(mp - 2/7): commenting out downcase call
  # because using case sensitive user_name 
  defp trim_user_name(user_name) do
    user_name
      |> String.trim
      #|> String.downcase
  end

  # TODO(mp): Need to implement response for user not
  # found.  Right now, I think client just gets
  # a 500
  def sign_in_user(conn, %{"username" => user_name, "password" => password}) do
    try do
      user = Mfac.Repo.get_by(User, user_name: trim_user_name(user_name)) |> Mfac.Repo.preload(:invitations)
      IO.inspect(user, label: "User ====")

      case is_binary(user.hashed_password) and authenticate(user, password) do
        true ->
          auth_conn = Accounts.Guardian.Plug.sign_in(conn, user) #|> IO.inspect(label: "AUTH CONN====")
          jwt = Accounts.Guardian.Plug.current_token(auth_conn) 

          auth_conn
          # |> put_resp_header("authorization", "Bearer #{jwt}")
          |> render(MfacWeb.UserView, "sign_in.json", user: user, token: jwt)
        false ->
          conn
          |> put_status(401)
          |> render(MfacWeb.ErrorView, "401.json-api")
      end

    rescue
      e ->
        IO.inspect e # Print error to the console for debugging
    end
  end

  # TODO(mp - 2/6): contacts returned from this
  # controller are currently just all users
  # excluding the requester.  Need to establish
  # some concept of "contacts" still 
  def user_data(conn, _params) do
    user = Mfac.Accounts.Guardian.Plug.current_resource(conn)
    invitations_query = 
      from i in Mfac.Meetings.Invitation,
        left_join: m in Mfac.Meetings.Meeting, on: i.meeting_id == m.id,
        left_join: inviter in Mfac.Accounts.User, on: i.inviter_id == inviter.id,
        left_join: invitee in Mfac.Accounts.User, on: i.invitee_id == invitee.id,
        where: i.invitee_id == ^user.id,
        preload: [
          meeting: m,
          inviter: inviter,
          invitee: invitee,
        ]
    invitations = Mfac.Repo.all(invitations_query)

    contacts_query = from u in User, where: u.id != ^user.id
    contacts = Mfac.Repo.all(contacts_query)

    data = %{
      user_data: user, 
      meeting_invitations: invitations, 
      contacts: contacts}

    render(conn, "user_data.json", user_data: data)
  end

end
