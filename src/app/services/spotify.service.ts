import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private spotifyUrl: string = 'https://accounts.spotify.com/';
  private clientId: string = '5cdb8b04c6fa4658b0c9a6329a2e88f1';
  private clientSecret: string = '129240bc03cb4c3984e637ecf61dd543';
  private redirectUri: string = 'http://localhost:4200/home';
  private scopes: string = 'user-read-private user-read-email';

  constructor(private http: HttpClient) {}

  authorizeUser() {
    const url =
      this.spotifyUrl +
      'authorize?client_id=' +
      this.clientId +
      '&response_type=code&redirect_uri=' +
      this.redirectUri +
      '&scope=' +
      this.scopes;
    return window.open(url);
  }

  accessTokenExchange(authorizationCode: string) {
    const url = this.spotifyUrl + 'api/token';
    const header = new HttpHeaders({
      'Authorization': `Basic ${btoa(this.clientId)}:${btoa(this.clientSecret)}`,
    });
    console.log(header);
    this.http
      .post(
        url,
        {
          grant_type: 'authorization_code',
          code: authorizationCode,
          redirect_uri: this.redirectUri,
        },
        {
          headers: header,
        }
      )
      .subscribe((res) => {
        console.log(res);
      });
  }
}
