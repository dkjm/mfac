defmodule MfacWeb.InvitationControllerTest do
  use MfacWeb.ConnCase

  alias Mfac.Meetings
  alias Mfac.Meetings.Invitation

  @create_attrs %{accepted_at: "2010-04-17 14:00:00.000000Z", declined_at: "2010-04-17 14:00:00.000000Z", status: "some status", verion: 42}
  @update_attrs %{accepted_at: "2011-05-18 15:01:01.000000Z", declined_at: "2011-05-18 15:01:01.000000Z", status: "some updated status", verion: 43}
  @invalid_attrs %{accepted_at: nil, declined_at: nil, status: nil, verion: nil}

  def fixture(:invitation) do
    {:ok, invitation} = Meetings.create_invitation(@create_attrs)
    invitation
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all invitations", %{conn: conn} do
      conn = get conn, invitation_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create invitation" do
    test "renders invitation when data is valid", %{conn: conn} do
      conn = post conn, invitation_path(conn, :create), invitation: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, invitation_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "accepted_at" => "2010-04-17 14:00:00.000000Z",
        "declined_at" => "2010-04-17 14:00:00.000000Z",
        "status" => "some status",
        "verion" => 42}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, invitation_path(conn, :create), invitation: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update invitation" do
    setup [:create_invitation]

    test "renders invitation when data is valid", %{conn: conn, invitation: %Invitation{id: id} = invitation} do
      conn = put conn, invitation_path(conn, :update, invitation), invitation: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, invitation_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "accepted_at" => "2011-05-18 15:01:01.000000Z",
        "declined_at" => "2011-05-18 15:01:01.000000Z",
        "status" => "some updated status",
        "verion" => 43}
    end

    test "renders errors when data is invalid", %{conn: conn, invitation: invitation} do
      conn = put conn, invitation_path(conn, :update, invitation), invitation: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete invitation" do
    setup [:create_invitation]

    test "deletes chosen invitation", %{conn: conn, invitation: invitation} do
      conn = delete conn, invitation_path(conn, :delete, invitation)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, invitation_path(conn, :show, invitation)
      end
    end
  end

  defp create_invitation(_) do
    invitation = fixture(:invitation)
    {:ok, invitation: invitation}
  end
end
