import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  search: Search = {
    artistName: '',
  };

  user: User = {
    name: '',
    email: '',
    id: '',
    country: '',
  };

  topArtists: TopArtists = {
    artists: [],
  };

  recentTracks: RecentTracks = {
    tracks: [],
  };

  private accessToken: any;

  constructor(
    private spotifyService: SpotifyService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const authorizationCode = await this.getAuthorizationCode();
    if (localStorage.length === 0) {
      this.accessToken = await this.getAccessToken(authorizationCode);
      localStorage.setItem('access_token', this.accessToken);
    } else {
      this.accessToken = localStorage.getItem('access_token');
    }

    await this.getCurrentUser(this.accessToken);
    await this.getTopArtists(this.accessToken);
    await this.getRecentTracks(this.accessToken);
    console.log(this.topArtists);
  }

  async getAuthorizationCode() {
    const data: any = new Promise((res, rej) => {
      this.activatedRoute.queryParams.subscribe(res);
    });
    return data.__zone_symbol__value.code;
  }

  async getAccessToken(authorizationCode: string) {
    const data: any = await this.spotifyService.accessTokenExchange(
      authorizationCode
    );
    return data.access_token;
  }

  async getCurrentUser(accessToken: string): Promise<void> {
    const data: any = await this.spotifyService.getCurrentUser(accessToken);
    this.user.name = data.display_name;
    this.user.email = data.email;
    this.user.id = data.id;
    this.user.country = data.country;
    console.log(this.user);
  }

  async getTopArtists(accessToken: string): Promise<void> {
    const data: any = await this.spotifyService.getTopArtists(accessToken);
    for (let i = 0; i < 9; i++) {
      const entry = data.items[i];
      const id = entry.uri.substring(15);
      const artist: Artist = {
        name: entry.name,
        totalFollowers: entry.followers.total,
        genres: entry.genres[0],
        imageUrl: entry.images[0].url,
        id,
        following: await this.getArtistFollowState(accessToken, id),
      };
      this.topArtists.artists.push(artist);
    }
  }

  async getRecentTracks(accessToken: string): Promise<void> {
    const data: any = await this.spotifyService.getRecentTracks(accessToken);
    for (let i = 0; i < 3; i++) {
      const entry = data.items[i];
      const track: Track = {
        trackName: entry.track.name,
        artist: entry.track.artists[0].name,
        albumName: entry.track.album.name,
        imageUrl: entry.track.album.images[0].url,
      };
      this.recentTracks.tracks.push(track);
    }
  }

  async getArtistFollowState(
    accessToken: string,
    artistId: string
  ): Promise<boolean> {
    const data: any = await this.spotifyService.getArtistFollowState(
      accessToken,
      artistId
    );
    return data[0];
  }

  followArtist(artistId: string): void {
    console.log(artistId);
    console.log(this.accessToken);
    this.spotifyService.followArtist(this.accessToken, artistId);
  }
}

interface Search {
  artistName: string;
}

interface User {
  name: string;
  email: string;
  id: string;
  country: string;
}

interface TopArtists {
  artists: Artist[];
}

interface Artist {
  name: string;
  totalFollowers: number;
  genres: string[];
  imageUrl: string;
  id: string;
  following?: boolean;
}

interface RecentTracks {
  tracks: Track[];
}

interface Track {
  trackName: string;
  artist: string;
  albumName: string;
  imageUrl: string;
}
