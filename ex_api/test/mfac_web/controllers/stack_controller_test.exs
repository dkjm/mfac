defmodule MfacWeb.StackControllerTest do
  use MfacWeb.ConnCase

  alias Mfac.Meetings
  alias Mfac.Meetings.Stack

  @create_attrs %{version: 42}
  @update_attrs %{version: 43}
  @invalid_attrs %{version: nil}

  def fixture(:stack) do
    {:ok, stack} = Meetings.create_stack(@create_attrs)
    stack
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all stack", %{conn: conn} do
      conn = get conn, stack_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create stack" do
    test "renders stack when data is valid", %{conn: conn} do
      conn = post conn, stack_path(conn, :create), stack: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, stack_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "version" => 42}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, stack_path(conn, :create), stack: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update stack" do
    setup [:create_stack]

    test "renders stack when data is valid", %{conn: conn, stack: %Stack{id: id} = stack} do
      conn = put conn, stack_path(conn, :update, stack), stack: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, stack_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "version" => 43}
    end

    test "renders errors when data is invalid", %{conn: conn, stack: stack} do
      conn = put conn, stack_path(conn, :update, stack), stack: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete stack" do
    setup [:create_stack]

    test "deletes chosen stack", %{conn: conn, stack: stack} do
      conn = delete conn, stack_path(conn, :delete, stack)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, stack_path(conn, :show, stack)
      end
    end
  end

  defp create_stack(_) do
    stack = fixture(:stack)
    {:ok, stack: stack}
  end
end
