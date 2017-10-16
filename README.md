# PhotoProof
A project for the 2017 [Tiger-Hacks](http://tiger-hacks.com/) hackathon.

## Inspiration

This idea emerged as a synthesis from my cryptocurrency class, my interest in security, and my background as a photographer. I had this idea very late on the first day after someone asked me a question about their project. I had planned on working on something else, but I liked this idea so much more that I scrapped my original plan.

## What it does

The software allows for instantaneous digital notary though the bitcoin blockchain. The software is targeted for the notarization of photographs, but it could be used on any digital file or data. One may use this for a variety of reasons:

* Proof of ownership
* Timestamping
* Document integrity and tamper protection

Note that all of these things can be done  *without revealing the source document.*

Photojournalists could thus use this to prove the validity of their documents and photographs. This would secure their claims to copyright, prevent malicious photo-shopping, and prove the timestamp and location data on the photograph is accurate.


## How it works

The digital file is hashed with a cryptographic hash. This hash is then placed into a special bitcoin transaction, one which allows for arbitrary data to be inserted. This transaction is then announced to the network, and it is put into the blockchain. Anyone can view the contents of the blockchain, and once data has been put on the blockchain it is there for good. Thus, anyone can now independently prove that they have a file which hashes to the same hash, thus that file existed in that state at the point in time the block was added to the chain.

Proof of ownership is established by proving that your private key was used to sign the bitcoin transaction.

## How I built it

The client side software is written in PhoneGap, which is basically a local webserver along with a captured web browser (can only go to one website). There are special Javascript hooks for the OS APIs like sensors, cameras, local file system, and so on.

The server side software is written in PHP, and it interfaces with a vanilla bitcoin node. I used PHP simply because it is exceptionally easy to use it in the environment where the bitcoin node is already running. I did not have time to setup and build a bitcoin node, and I am but a lowly user with student privileges on this system, so I had to use what was available.

The PHP interfaces with the bitcoin-cli though a fantastically simple [library by coinspark](https://github.com/coinspark/php-OP_RETURN). The client makes post requests for both new hashes to put on the network, and to check the block depth of past hashes. The PHP formulates the request for the bitcoin-cli, executes the command, and then returns the result to the client.

To save myself time, money, and headache, PhotoProof is currently configured to use the bitcoin testnet. The node I have access to has a whopping 12 bitcoins...... on testnet.

## Challenges and What I learned

I had never used PhoneGap before. Its a novel idea, but I don't know how well it would work for projects which are very complex. I also ran into some simple problems that made me question the actual usability of PhoneGap. For example, certain local file system URLs returned by the system file picker cannot be accessed by Javascript, but can still be used by HTML DOM elements. Thus, if you want to process a picture in javascript you have to set a DOM element to source the file, then dump the state of that DOM element in Javascript (canvases are prime choices for this).

There were a lot of weird things happening with my PHP. Lots of file permission errors and other things I didn't predict. I also had to make the user under which PHP executes authorized to access the bitcoin-cli, but my account did not have the necessary permissions to make that change. I did not predict this because running PHP via command line runs it in your userspace, unlike PHP executed during a web request. I sent a text way too late at night to the sys-admin, making my case, and luckily he set the permissions!

## What's next for PhotoProof

I probably won't develop this further. It is more of a proof-of-concept just for my curiosity. Additionally, while sending an email to a bunch of people isn't 'provably' accurate, it would work for most people.

Possible future expansion:

* Biggest problem is that bitcoin main-net costs around $6 per transaction. A different blockchain would be highly preferable.
* Have the ability to select and assure which metadata is kept with the photo when being hashed. For example, GPS co-ordinates.
* Some other simple features could be added, like wifi direct for submitting photos directly from a DSLR camera.
* The client software should be rewritten in Android studio or some other 'native' language. Some steps in the hashing process are unacceptably slow, especially with large photos.
