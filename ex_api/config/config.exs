# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :mfac,
  ecto_repos: [Mfac.Repo]

# Configures the endpoint
config :mfac, MfacWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "g7aUcdC8wymKVG1bHuJgMNRFnn6AHlw1bgjr9Bnb6rWJtDPt5VEoa4gqb2LX8lL3",
  render_errors: [view: MfacWeb.ErrorView, accepts: ~w(json)],
  pubsub: [name: Mfac.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
