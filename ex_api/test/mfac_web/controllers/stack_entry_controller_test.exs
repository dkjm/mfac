defmodule MfacWeb.StackEntryControllerTest do
  use MfacWeb.ConnCase

  alias Mfac.Meetings
  alias Mfac.Meetings.StackEntry

  @create_attrs %{allotted_duration: 42, closed_at: "2010-04-17 14:00:00.000000Z", opened_at: "2010-04-17 14:00:00.000000Z", status: "some status", version: 42}
  @update_attrs %{allotted_duration: 43, closed_at: "2011-05-18 15:01:01.000000Z", opened_at: "2011-05-18 15:01:01.000000Z", status: "some updated status", version: 43}
  @invalid_attrs %{allotted_duration: nil, closed_at: nil, opened_at: nil, status: nil, version: nil}

  def fixture(:stack_entry) do
    {:ok, stack_entry} = Meetings.create_stack_entry(@create_attrs)
    stack_entry
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all stack_entries", %{conn: conn} do
      conn = get conn, stack_entry_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create stack_entry" do
    test "renders stack_entry when data is valid", %{conn: conn} do
      conn = post conn, stack_entry_path(conn, :create), stack_entry: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, stack_entry_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "allotted_duration" => 42,
        "closed_at" => "2010-04-17 14:00:00.000000Z",
        "opened_at" => "2010-04-17 14:00:00.000000Z",
        "status" => "some status",
        "version" => 42}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, stack_entry_path(conn, :create), stack_entry: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update stack_entry" do
    setup [:create_stack_entry]

    test "renders stack_entry when data is valid", %{conn: conn, stack_entry: %StackEntry{id: id} = stack_entry} do
      conn = put conn, stack_entry_path(conn, :update, stack_entry), stack_entry: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, stack_entry_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "allotted_duration" => 43,
        "closed_at" => "2011-05-18 15:01:01.000000Z",
        "opened_at" => "2011-05-18 15:01:01.000000Z",
        "status" => "some updated status",
        "version" => 43}
    end

    test "renders errors when data is invalid", %{conn: conn, stack_entry: stack_entry} do
      conn = put conn, stack_entry_path(conn, :update, stack_entry), stack_entry: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete stack_entry" do
    setup [:create_stack_entry]

    test "deletes chosen stack_entry", %{conn: conn, stack_entry: stack_entry} do
      conn = delete conn, stack_entry_path(conn, :delete, stack_entry)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, stack_entry_path(conn, :show, stack_entry)
      end
    end
  end

  defp create_stack_entry(_) do
    stack_entry = fixture(:stack_entry)
    {:ok, stack_entry: stack_entry}
  end
end
