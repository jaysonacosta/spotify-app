import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private spotifyUrl: string = 'https://accounts.spotify.com/';
  private apiUrl: string = 'https://api.spotify.com/';
  private clientId: string = '5cdb8b04c6fa4658b0c9a6329a2e88f1';
  private clientSecret: string = '129240bc03cb4c3984e637ecf61dd543';
  private redirectUri: string = 'http://localhost:4200/home';
  private scopes: string =
    'user-read-private user-read-email user-read-recently-played user-top-read';

  constructor(private http: HttpClient) {}

  async authorizeUser(): Promise<void> {
    const url =
      this.spotifyUrl +
      'authorize?client_id=' +
      this.clientId +
      '&response_type=code&redirect_uri=' +
      this.redirectUri +
      '&scope=' +
      this.scopes +
      '&state=34fFs29kd09';
    window.open(url, '_self');
  }

  accessTokenExchange(authorizationCode: string) {
    const url = this.spotifyUrl + 'api/token';
    const params = new HttpParams({
      fromObject: {
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: this.redirectUri,
      },
    });
    const base64 = btoa(this.clientId + ':' + this.clientSecret);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Basic ' + base64,
      }),
    };
    return this.http.post(url, params, httpOptions);
  }

  getCurrentUser(accessToken: string) {
    const url = this.apiUrl + 'v1/me';
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + accessToken,
      }),
    };
    return this.http.get(url, httpOptions);
  }

  getTopArtists(accessToken: string) {
    const url = this.apiUrl + 'v1/me/top/artists';
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + accessToken,
      }),
    };
    return this.http.get(url, httpOptions);
  }
}
