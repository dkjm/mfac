defmodule MfacWeb.AmendmentControllerTest do
  use MfacWeb.ConnCase

  alias Mfac.Meetings
  alias Mfac.Meetings.Amendment

  @create_attrs %{decided_at: "2010-04-17 14:00:00.000000Z", deleted_at: "2010-04-17 14:00:00.000000Z", description: "some description", meeting_action: "some meeting_action", status: "some status", title: "some title", version: 42}
  @update_attrs %{decided_at: "2011-05-18 15:01:01.000000Z", deleted_at: "2011-05-18 15:01:01.000000Z", description: "some updated description", meeting_action: "some updated meeting_action", status: "some updated status", title: "some updated title", version: 43}
  @invalid_attrs %{decided_at: nil, deleted_at: nil, description: nil, meeting_action: nil, status: nil, title: nil, version: nil}

  def fixture(:amendment) do
    {:ok, amendment} = Meetings.create_amendment(@create_attrs)
    amendment
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all amendments", %{conn: conn} do
      conn = get conn, amendment_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create amendment" do
    test "renders amendment when data is valid", %{conn: conn} do
      conn = post conn, amendment_path(conn, :create), amendment: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, amendment_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "decided_at" => "2010-04-17 14:00:00.000000Z",
        "deleted_at" => "2010-04-17 14:00:00.000000Z",
        "description" => "some description",
        "meeting_action" => "some meeting_action",
        "status" => "some status",
        "title" => "some title",
        "version" => 42}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, amendment_path(conn, :create), amendment: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update amendment" do
    setup [:create_amendment]

    test "renders amendment when data is valid", %{conn: conn, amendment: %Amendment{id: id} = amendment} do
      conn = put conn, amendment_path(conn, :update, amendment), amendment: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, amendment_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "decided_at" => "2011-05-18 15:01:01.000000Z",
        "deleted_at" => "2011-05-18 15:01:01.000000Z",
        "description" => "some updated description",
        "meeting_action" => "some updated meeting_action",
        "status" => "some updated status",
        "title" => "some updated title",
        "version" => 43}
    end

    test "renders errors when data is invalid", %{conn: conn, amendment: amendment} do
      conn = put conn, amendment_path(conn, :update, amendment), amendment: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete amendment" do
    setup [:create_amendment]

    test "deletes chosen amendment", %{conn: conn, amendment: amendment} do
      conn = delete conn, amendment_path(conn, :delete, amendment)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, amendment_path(conn, :show, amendment)
      end
    end
  end

  defp create_amendment(_) do
    amendment = fixture(:amendment)
    {:ok, amendment: amendment}
  end
end
