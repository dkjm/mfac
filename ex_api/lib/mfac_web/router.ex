defmodule MfacWeb.Router do
  use MfacWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", MfacWeb do
    pipe_through :api
  end
end
