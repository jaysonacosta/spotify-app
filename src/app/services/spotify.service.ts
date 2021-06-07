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
    'user-read-private user-read-email user-read-recently-played user-top-read user-follow-read user-follow-modify';

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
    return new Promise((res, rej) => {
      this.http.post(url, params, httpOptions).toPromise().then(res).catch(rej);
    });
  }

  getCurrentUser(accessToken: string) {
    const url = this.apiUrl + 'v1/me';
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + accessToken,
      }),
    };
    return new Promise((res, rej) => {
      this.http.get(url, httpOptions).toPromise().then(res).catch(rej);
    });
  }

  getTopArtists(accessToken: string) {
    const url = this.apiUrl + 'v1/me/top/artists';
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + accessToken,
      }),
    };
    return new Promise((res, rej) => {
      this.http.get(url, httpOptions).toPromise().then(res).catch(rej);
    });
  }

  getRecentTracks(accessToken: string) {
    const url = this.apiUrl + 'v1/me/player/recently-played';
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + accessToken,
      }),
    };
    return new Promise((res, rej) => {
      this.http.get(url, httpOptions).toPromise().then(res).catch(rej);
    });
  }

  getArtistFollowState(accessToken: string, artistId: string) {
    const url = this.apiUrl + 'v1/me/following/contains';
    const httpOptions = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + accessToken
    );
    const params = new HttpParams().set('type', 'artist').set('ids', artistId);
    return new Promise((res, rej) => {
      this.http
        .get(url, {
          headers: httpOptions,
          params: params,
        })
        .toPromise()
        .then(res)
        .catch(rej);
    });
  }

  followArtist(accessToken: string, artistId: string) {
    const url = this.apiUrl + 'v1/me/following';
    const httpOptions = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + accessToken
    );
    const params = new HttpParams().set('type', 'artist').set('ids', artistId);
    this.http.put(url, {
      headers: httpOptions,
      params: params,
    }).subscribe(res => console.log(res), err => console.log(err));
  }
}
