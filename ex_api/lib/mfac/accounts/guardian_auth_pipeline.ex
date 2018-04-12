defmodule Mfac.Accounts.Guardian.AuthPipeline do
  @claims %{typ: "access"}
 
  use Guardian.Plug.Pipeline, otp_app: :mfac,
                              module: Mfac.Accounts.Guardian,
                              error_handler: Mfac.Accounts.AuthErrorHandler
 
  plug Guardian.Plug.VerifySession, claims: @claims
  plug Guardian.Plug.VerifyHeader, claims: @claims, realm: "Bearer"
  plug Guardian.Plug.LoadResource, allow_blank: true
end
